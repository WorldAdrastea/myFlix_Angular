import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = "https://secret-peak-11846.herokuapp.com/";
@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  /**
    * Sends user registration data to the backend.
    * @param userDetails - The user registration data.
    * @returns An observable with the registration response.
    */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

   /**
    * Sends user login data to the backend.
    * @param userDetails - The user login data.
    * @returns An observable with the login response.
    */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * Retrieves information about all movies in the movies endpoint from the API.
    * @returns An observable with the movies response.
    */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Retrieves information about a specific movie based on its title.
    * @param title - The title of the movie.
    * @returns An observable with the movie response.
    */
  getMovies(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Retrieves information about directors from director endpoint.
    * @param directorName - Name of director.
    * @returns An observable with the director response.
    */

  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /**
    * Retrieves information about movies of a specific genre based on the genre name.
    * @param genreName - The name of the genre.
    * @returns An observable with the genre response.
    */

  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Retrieves information about the logged-in user.
    * @returns An observable with the user response.
    */

  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Retrieves a user's list of favourited movies.
    * @returns An observable with the user's list of favourited movies.
    */
  getFavouriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => {
        return data.FavouriteMovies
      }),
      catchError(this.handleError)
    );
  }

  /**
    * Adds a movie to user's list of favourite movies.
    * @param movieId - The ID of the movie that is added to the favourite list.
    * @returns An observable with the response after adding the movies to the favourite list.
    */
  addFavouriteMovies(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.FavouriteMovies = user.FavouriteMovies || [];
    user.FavouriteMovies.push(movieId);

    localStorage.setItem('user', JSON.stringify(user));

    console.log('Updated user favourites:', user.FavouriteMovies);
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Checks if selected movie is already on user's favourite's list.
    * @param movieId - The ID of the movie selected to compare.
    * @returns An boolean that states whether the movie is in the user's favourites list.
    */
  isFavouriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.FavouriteMovies && user.FavouriteMovies.includes(movieId);
  }

  /**
    * Edits the user profile information and sends the updated information to the backend.
    * @param updatedUser - The updated user profile information.
    * @returns An observable with the response after updating the user profile.
    */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * Deletes the user's account.
    * @returns An observable with the response after deleting the user's account.
    */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * Deletes a movie from a user's favourite movie list.
    * @param movieId - The ID of the movie that will be removed from the user's favourites list.
    * @returns An observable with the response after deleting the movie from the user's favourites list.
    */
  deleteFavouriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError),
      map(() => {
        const movieIndex = user.FavouriteMovies.indexOf(movieId);
        if (movieIndex !== -1) {
          user.FavouriteMovies.splice(movieIndex, 1);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Updated user favourites:', user.FavouriteMovies);
        }
      })
    );
  }

  /**
    * Handles non-typed response extraction.
    * @param res - The HTTP response.
    * @returns The extracted response body or an empty object.
    */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
    * Handles HTTP error responses.
    * @param error - The HTTP error response.
    * @returns An observable with an error message.
    */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
      `Error Status code ${error.status}, ` +
      `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}