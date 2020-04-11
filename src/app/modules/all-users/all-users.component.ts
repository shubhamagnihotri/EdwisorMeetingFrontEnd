import { Component, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService} from "../../services/user.service";
import { IfStmt } from '@angular/compiler';
import {AuthService} from "../../services/auth.service"
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],

})

export class AllUsersComponent implements OnInit {
  skip = 0;
  limit =2;
  userData:[]=[];
  moveforward:boolean = true;
  token='';
  constructor(private _snackBar: MatSnackBar,public route:Router,public user:UserService,public auth:AuthService) { }

  ngOnInit() {
    this.token= this.auth.getFromLocalStore('_token');
    this.getAllUserByLimit();
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
    })
  }
  paginateData(term){
    if(term == 'prev'){
       
      this.skip = this.skip == 0 ? this.skip:this.skip-this.limit;
      if(!this.moveforward){
        this.skip =this.skip - 2;
      } 
      this.getAllUserByLimit();
    }else{  
      if(this.moveforward){
        this.skip +=  this.limit 
      }else{
        this.skip = this.skip;
      }
      // this.moveforward == true ? this.skip +=  this.limit : this.skip =  this.skip;
      this.getAllUserByLimit();
    }

  }
  
  getAllUserByLimit(){
  
    this.user.getAllUserByLimit(this.skip,this.limit,this.token).subscribe((data)=>{
      console.log(data);
      if(data.status == 404 && data.error== true && data.message =="No User Found"){
        this.moveforward = false;
        //this.skip =-
        
        this.openSnackBar(data.message,'failed')
      }else if(data.error == false && data.status == 200){
        this.userData = data.data;
        this.moveforward = true;
        this.openSnackBar(data.message,'success');
      }else if(data.error){
        this.openSnackBar(data.message,'failed');
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
      this.openSnackBar(error,'failed');
    })
  }

  goToCalendarNavigate(userId){
      this.route.navigate(['dashboard/user-calendar',userId]);
  }

  gotoViewAllMeeting(userId){
    this.route.navigate(['dashboard/view-user-all-meeting',userId]);
    
  }

}
