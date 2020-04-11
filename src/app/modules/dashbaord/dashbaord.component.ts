import { Component, OnInit } from '@angular/core';


import {MatSnackBar} from '@angular/material/snack-bar';

import { UserService} from "../../services/user.service";
import { MeetingService} from "../../services/meeting.service";
import { Router,ActivatedRoute} from '@angular/router';
import { AuthService} from "../../services/auth.service"
@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.css']
})
export class DashbaordComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,public route:Router,public user:UserService,public meeting:MeetingService,
    public activateRoute:ActivatedRoute,public auth:AuthService) { }
  userId:string;
  allMeetings:[]=[];
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
  ngOnInit() {
    this.userId = this.activateRoute.snapshot.paramMap.get('userId');
    this.userDetails= this.auth.getFromLocalStore('userDetails');
    this.getAllMeeting();
  }

  openSnackBar(message: string, action: string,duration?) {
    let background="";
    if(action == 'success'){
      background = 'green-snackbar';
    }
    if(action == 'failed'){
      background = 'red-snackbar';
    }
    this._snackBar.open(message, action, {
      duration: duration || 2000,
      panelClass: [background]
    });
  }

  goToCalendarPage(){
    this.route.navigate(['dashboard/user-calendar',this.userId]);
  }

  getAllMeeting(){
    this.meeting.getAllMeeting(this.userId,null,this.userDetails._token).subscribe((res)=>{
    
      if(res.error){
        this.openSnackBar(res.message,'failed');
      }else if(res.error == false && res.status == 200){
        this.allMeetings = res.data;  
        console.log(this.allMeetings);
        this.openSnackBar(res.message,'success');
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
       this.openSnackBar(error,'failed');
    });
  }

}
