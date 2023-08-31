import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service'
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {
  user: any;
  favouriteMovies: { _id: string, Title: string }[] = [];
  movies: any[] = [];

  @Input() userInfo = { Username: '', Password: '', Email: '', Birthday: ''};

  constructor(
    public fetchApiData: UserRegistrationService,
    public snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
    * Fetches user details and related favorite movies from the API.
    */

  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      console.log('User response:', resp);
      this.user = resp;
      this.userInfo.Username = this.user.Username;
      this.userInfo.Email = this.user.Email;
      this.userInfo.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-UK', 'UTC+0');

      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        console.log('All movies response:', resp);
        this.favouriteMovies = resp.filter((m: { _id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0)
      }, (error) => {
        console.log('Error: ', error);
      })
    })
  }

  /**
    * Edits the user's profile information.
    * Updates the local storage and displays a success or error message.
    */

  editUserProfile(): void {
    this.fetchApiData.editUser(this.userInfo).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));

      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  /**
    * Deletes the user's profile.
    * Clears local storage, navigates to the welcome page, and displays messages.
    */

  deleteUserProfile(): void {
    this.fetchApiData.deleteUser().pipe(
      finalize(() => {
        localStorage.clear();
        this.router.navigate(['welcome']);
      })
    ).subscribe(
      (result) => {
        console.log(result);
        const snackBarRef = this.snackBar.open('Account successfully deleted', 'OK', {
          duration: 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.snackBar.open('You have been returned to the main page.', 'OK', {
            duration: 5000
          });
        })
      },
      (error) => {
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
