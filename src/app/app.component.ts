import { Component,OnInit,AfterViewInit } from '@angular/core';
import {AuthService} from '../../src/app/services/auth.service';
import { Router,NavigationStart } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MeetingPlannerFront';
  userDetails={
    role: "",
    countryCode: "",
    mobileNumber: "",
    email: "",
    lastName: "",
    firstName: "",
    userId: "",
    _token:""
  };
  constructor(public auth:AuthService,public route:Router){

  }

  ngOnInit(){
   this.checkRoute();
  }

  checkRoute(){
        // let userDetails= this.auth.getFromLocalStore('userDetails');
        // this.userDetails = userDetails;
        // if(this.userDetails){
        //   if(this.userDetails.role =="admin"){ 
        //     this.route.navigate(['dashboard','all-users']);
        //   }else{
        //     this.route.navigate(['dashboard/user-calendar',this.userDetails.userId]);
        //   }
        // }else{
        //   this.route.navigate(['auth'])
        // }
  }
    

 
}
