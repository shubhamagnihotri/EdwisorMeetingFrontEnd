import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError,of  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

const BASE_URL = "http://localhost:3000"
@Injectable({
  providedIn: 'root'
})
export class MeetingSocketService {
  private socket;
  private authToken;
  constructor(public http:HttpClient) { 
    this.socket = io(BASE_URL);
   
  }

  public verifyUser(){
    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
        observer.next(data)
      })
    })
  }

  public setUser(authToken){
    this.socket.emit('set-user',authToken)
  }

  public meetingUpdatedSocket(data){
    this.socket.emit('meeting-updated',data)
  }

  public getMeetingUpdatedSocket(userId){
    return  Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
        observer.next(data);
      })
    })
  }


  public getOnlineUserList(){
   return  Observable.create((observer)=>{
        this.socket.on('online-user-list',(userList)=>{
          observer.next(userList);
        })
    })
  }

  public authError(){
    return  Observable.create((observer)=>{
         this.socket.on('auth-error',(serverResponse)=>{
           observer.next(serverResponse);
         })
     })
   }


   
  public exitSocket = () =>{
    this.socket.disconnect();
  }// end exit socket


}
