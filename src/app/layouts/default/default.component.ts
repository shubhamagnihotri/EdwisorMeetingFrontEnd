import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  public sideBarDetail={
    showIconMenu:false,
    width: "160px"
  }
  constructor() { }
 
  ngOnInit() {
  }

  menuToggleFunc(data){
    this.sideBarDetail = data;
    console.log(data);
  }

}
