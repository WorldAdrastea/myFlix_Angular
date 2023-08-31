// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileComponent } from '../user-profile/user-profile.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any;
  
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
    * Fetches the list of movies from the API.
    * @returns An array of movies.
    */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
    * Fetches the Genre and it's description of the movie from the API.
    * @param name 
    * @param description 
    */
  
  getGenre(name: string, description: string): void {
    this.openDialog(name, description);
  }

  /**
    * Fetches the Director and their bio of the movie from the API.
    * @param name 
    * @param bio 
    */
  
  getDirector(name: string, bio: string): void {
    this.openDialog(name, bio);
  }

  /**
    * Fetches the Description and name of movie from the API. 
    * @param name 
    * @param description 
    */

  getSynopsis(name: string, description: string): void {
    this.openDialog(name, description);
  }

  /**
    * Opens a dialog to display genre, director, or synopsis information.
    * @param title - The title of the dialog.
    * @param content - The content to display in the dialog.
    */
  
  openDialog(title: string, content: string): void {
    const dialogRef = this.dialog.open(MovieInfoComponent, {
      width: '400px',
      data: { title, content }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed')
    })
  }

  /**
    * Adds a movie to the user's favorites list.
    * @param id - The ID of the movie to be added.
    */

  addToFavourites(id: string): void {
    this.fetchApiData.addFavouriteMovies(id).subscribe(
      (resp: any) => {
        console.log('Movie added to favorites:', resp);
        this.snackBar.open('Movie added to favourites list.', 'OK', {
          duration: 2000
        });
      },
      (error: any) => {
        console.error('Error adding movie to favourites:', error);
        this.snackBar.open('Failed to add movie to favourites.', 'OK', {
          duration: 2000
        });
      }
    )
  }

  /**
    * Checks if a movie is in the user's favorites list.
    * @param id - The ID of the movie to be checked.
    * @returns A boolean indicating whether the movie is in favorites.
    */

  isFavourite(id: string): boolean {
    return this.fetchApiData.isFavouriteMovie(id);
  }

  /**
    * Removes a movie from the user's favorites list.
    * @param id - The ID of the movie to be removed.
    */

  removeFromFavourites(id: string): void {
    this.fetchApiData.deleteFavouriteMovie(id).subscribe((resp) => {
      this.snackBar.open('Movie has been removed from favourites list.', 'OK', {
        duration: 2000
      });
    });
  }

  /**
    * Toggles a movie's existance in the user's favorites list.
    * @param id - The ID of the movie to be toggled.
    */

  toggleFavourites(id: string): void {
    if (this.isFavourite(id)) {
      this.removeFromFavourites(id);
    } else {
      this.addToFavourites(id);
    }
  }

  /**
    * Opens a dialog displaying the user's profile information.
    */

  openUserProfileDialog(): void {
    this.dialog.open(UserProfileComponent, {
    width: '280px'
    });
  }
}