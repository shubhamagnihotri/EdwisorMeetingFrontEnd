import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from "../../services/auth.service"
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  private forgetPasswordData: {} = { email: "", otp: "",password:"" };
  constructor(private _snackBar: MatSnackBar,public auth:AuthService) { }
  emailSubmit = false;
  ngOnInit() {

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

  checkUserAndGenerateOtp(forgetFormData){
    console.log(forgetFormData.value);
    let payload = forgetFormData.value;
    this.auth.otpGenerateForForgetPassword(payload).subscribe((data)=>{
      // console.log(data);
      if (data.error) {
        this.openSnackBar(data.message, 'failed');
      } else if (data.error == false && data.status == 200) {
        this.emailSubmit = true;
        this.openSnackBar(data.message, 'success');
      } else {
        this.openSnackBar(`unkown error`, 'failed')
      }
    }, (error) => {
      forgetFormData.reset();
      this.openSnackBar(error, 'failed');
    })
  }

  checkOtpValidate(forgetFormData){
    let payload = forgetFormData.value;
    this.auth.OtpValidateForForgetPassword(payload).subscribe((data)=>{
     
      if (data.error) {
        this.openSnackBar(data.message, 'failed');
      } else if (data.error == false && data.status == 200) {
        this.emailSubmit = false;
        forgetFormData.reset();
        this.openSnackBar(data.message, 'success');
        
      } else {
        this.openSnackBar(`unkown error`, 'failed')
      }
    }, (error) => {
      forgetFormData.reset();
      this.openSnackBar(error, 'failed');
    })
    
  }

  resetForm(forgetFormData){
    forgetFormData.reset();
    // forgetFormData.markAsUntouched()
    this.emailSubmit = false;
  }

  goToLogin(){
    
  }

}
