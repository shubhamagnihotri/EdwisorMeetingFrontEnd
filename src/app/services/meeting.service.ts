import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError,of  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
const Base_URL = "http://localhost:3000/api/v1/users/";
import {MeetingSocketService} from './meeting-socket.service';
@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept':'text/plain' })
  };
  constructor( private http:HttpClient,public router:Router,public meetingSocket:MeetingSocketService) { }

  createMeeting(data,userId,authToken):Observable<any>{
   data.meetingUserId = userId
    return this.http.post<any>(Base_URL+'createMeeting?authToken='+authToken,data,this.httpOptions)
      .pipe(
        tap(_ => console.log("http called ended")
          ),
        catchError(this.handleError)
      );
  }

  callUpdateMeeting(meetingId,result,authToken):Observable<any>{
   
    return this.http.post<any>(Base_URL+'updateMeeting/'+meetingId+'?authToken='+authToken,result,this.httpOptions)
      .pipe(
        tap(_ => console.log("http called ended")
          ),
        catchError(this.handleError)
      );
  }

  getAllMeeting(userId,meetingId?,authToken?){
    let data={}
    if(meetingId){
      data= {meetingId:meetingId};
    }else{
       data= {userId:userId};
    } 
    return this.http.post<any>(Base_URL+'getUserAllMeeting?authToken='+authToken,data,this.httpOptions)
      .pipe(
        tap(_ => console.log("http called ended")
          ),
        catchError(this.handleError)
    );
  }

  deleteMeeting(meetingId,userId?,authToken?){
    let payLoad={meetingId:meetingId,userId:''};
    if(userId){
      payLoad.userId = userId;
    }
    payLoad.meetingId = meetingId;
    return this.http.post<any>(Base_URL+'deleteMeeting?authToken='+authToken,payLoad,this.httpOptions)
      .pipe(
        tap(_ => console.log("http called ended")
          ),
        catchError(this.handleError)
      );
  }

    getSnooozedTime(meetingUserId,authToken?){
   
      return this.http.post<any>(Base_URL+'getTodayMeetingsForSnooze?authToken='+authToken,{meetingUserId:meetingUserId},this.httpOptions)
        .pipe(
          tap(_ => console.log("http called ended")
            ),
          catchError(this.handleError)
        );
    }

    updateSnoozeOnMeeting(meetingId,authToken){
      return this.http.post<any>(Base_URL+'updateMeetingSnooze?authToken='+authToken,{meetingId:meetingId},this.httpOptions)
      .pipe(
        tap(_ => console.log("http called ended")
          ),
        catchError(this.handleError)
      );
    }

     // Error handling 
     handleError(error) {
      let errorMessage = '';
     
      if(error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        if(error.error.error){
          console.log(error)
         
          errorMessage = `${error.error.message}`;
          if(error.error.data && error.error.data.p_response_code){
            localStorage.clear()
            this.meetingSocket.exitSocket();
            this.router.navigate(['/auth']);
          }
        }else{
          console.log(error)
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
        }
      }
     return throwError(errorMessage);
   }
 
}
