import { Component } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {
  user: any;
  constructor(public fetchApiData: UserRegistrationService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const loggedIn = localStorage.getItem('user');
    if (loggedIn !== null) {
      this.fetchApiData.getUser().subscribe((resp: any) => {
        this.user = resp;
      });
    } else {
      console.error('No user found');
    }
  }
}
