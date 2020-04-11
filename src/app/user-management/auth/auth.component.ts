import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnakebarService } from "../../services/snakebar.service"
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private loginUserData: {} = { email: "", password: "" };
  private countryCOde: {} = {}
  private signupUserData: {} = { firstName: "", lastName: "", password: "", email: "", mobileNumber: "", countryCode: "" };
  private countryCOdeData: {} = {}
  private countryShortName = [];
  constructor(public auth: AuthService, public toast: SnakebarService, private _snackBar: MatSnackBar, public route: Router) { }

  ngOnInit() {
    this.getCountryCode();

  }


  openSnackBar(message: string, action: string, duration?) {
    let background = "";
    if (action == 'success') {
      background = 'green-snackbar';
    }
    if (action == 'failed') {
      background = 'red-snackbar';
    }
    this._snackBar.open(message, action, {
      duration: duration || 2000,
      panelClass: [background]
    });
  }

  appLogin(loginFormData) {

    this.auth.gotoLogin(this.loginUserData).subscribe((data) => {

      if (data.error) {
        // alert('sdasdkjsdj');
        this.openSnackBar(data.message, 'failed');
      } else if (data.error == false && data.status == 200) {
        this.auth.setLocalStor('_token', data.data.authToken);
        this.auth.setLocalStor('userDetails', data.data.userDetails)
        loginFormData.reset();
        this.openSnackBar(data.message, 'success');
        if (data.data.userDetails.role == 'admin') {
          this.route.navigate(['dashboard', 'all-users']);
        } else {
          this.route.navigate(['dashboard/user-calendar', data.data.userDetails.userId]);
        }
      } else {
        this.openSnackBar(`unkown error`, 'failed')
      }
    }, (error) => {
      this.openSnackBar(error, 'failed');
    })
  }// login function created;

  getCountryCode() {
    let data = this.auth.getCountryData();
    this.countryShortName = Object.keys(JSON.parse(data))
    this.countryCOdeData = JSON.parse(data);
    console.log(   this.countryCOdeData);
  }// get country number code and name 

  appSignUp(signUpFormData) {
    let signupData= signUpFormData.value;
    signupData.countryCode = this.countryCOdeData[signUpFormData.value.countryCode];
    this.auth.goToSignUp(signupData).subscribe((data) => {
      if (data.error) {
        this.openSnackBar(data.message, 'failed')
      } else {
        signUpFormData.reset();
       // this.signupUserData = { firstName: "", lastName: "", password: "", email: "", mobileNumber: "", countryCode: "" };
        this.openSnackBar(data.message, 'success', 4000);
      }
    }, (error) => {
      this.openSnackBar(error, 'failed');
    })
  }

  goToForgetPaasword(){
    this.route.navigate(['auth', 'forget-passwod']);
  }

 



}
