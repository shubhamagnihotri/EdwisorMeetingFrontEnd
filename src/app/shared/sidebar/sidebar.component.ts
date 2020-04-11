import { Component, OnInit,Input } from '@angular/core';
import {AuthService} from "../../services/auth.service"
import {Router} from "@angular/router"
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() sideBarDetail;
  showIconMenu:boolean;
  width:string
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
  constructor(public auth:AuthService,public route:Router) { }

  ngOnInit() {
    this.userDetails= this.auth.getFromLocalStore('userDetails');
    // console.log("asdsdsd");
    // console.log(this.sideBarDetail)
    // this.showIconMenu = this.sideBarDetail.showIconMenu;
    // this.width = this.sideBarDetail.width
  }

  goRoutingPage(url,dyanamicId?){
    if(dyanamicId){
      this.route.navigate([url,dyanamicId])
    }else{
      this.route.navigate([url])
    }
  }

}
