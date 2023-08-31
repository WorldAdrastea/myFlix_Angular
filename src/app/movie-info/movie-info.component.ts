import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit {
  /**
    * 
    * @param data 
    */
  constructor (
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      title: string;
      content: string;
    }
  ) { }

  ngOnInit(): void { }
}
