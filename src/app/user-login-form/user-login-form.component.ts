import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css']
})

export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: ''};

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      
      localStorage.setItem("user", JSON.stringify(result.user))
      localStorage.setItem("token", result.token);
      localStorage.setItem("Username", result.user.Username)

      this.dialogRef.close();

      this.router.navigate(['movies']);

      this.snackBar.open('Logged in!', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open('Unable to log in.', 'OK', {
        duration: 2000
      });
    });
  }
}
