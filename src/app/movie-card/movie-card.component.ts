// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  
  getGenre(name: string, description: string): void {
    this.openDialog(name, description);
  }

  getDirector(name: string, bio: string): void {
    this.openDialog(name, bio);
  }

  getSynopsis(name: string, description: string): void {
    this.openDialog(name, description);
  }

  openDialog(title: string, content: string): void {
    const dialogRef = this.dialog.open(MovieInfoComponent, {
      width: '400px',
      data: { title, content }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed')
    })
  }

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

  isFavourite(id: string): boolean {
    return this.fetchApiData.isFavouriteMovie(id);
  }

  removeFromFavourites(id: string): void {
    this.fetchApiData.deleteFavouriteMovie(id).subscribe((resp) => {
      this.snackBar.open('Movie has been removed from favourites list.', 'OK', {
        duration: 2000
      });
    });
  }

  toggleFavourites(id: string): void {
    if (this.isFavourite(id)) {
      this.removeFromFavourites(id);
    } else {
      this.addToFavourites(id);
    }
  }
}