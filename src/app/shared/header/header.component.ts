import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MeetingSocketService} from "../../services/meeting-socket.service";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() public menuToggle: EventEmitter<any> = new EventEmitter<any>();
  showIconMenu = false;
   width = '210px';
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
  constructor(public auth:AuthService,public meetingSocket:MeetingSocketService,public router:Router,private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userDetails= this.auth.getFromLocalStore('userDetails');
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

  toggleMenu(): void {
    this.showIconMenu = !this.showIconMenu;
     let width = this.showIconMenu ? '85px' : '160px'; 
    let data={
      showIconMenu:this.showIconMenu,
      width:width
    }
    // console.log(data);
    this.menuToggle.emit(data)
  }
  goRoutingPage(url,dyanamicId?){
    if(dyanamicId){
      this.router.navigate([url,dyanamicId])
    }else{
      this.router.navigate([url])
    }
  }
  goToLogout(){
    this.auth.goToLogOut();
    this.meetingSocket.exitSocket();
    this.router.navigate(['/auth']);
    setTimeout(()=>{
      this.openSnackBar(`Logout Successfully !!`,'success');
    },1000);
   
  }

}
