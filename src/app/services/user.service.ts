import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError,of  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
const Base_URL = "http://localhost:3000/api/v1/users/";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept':'text/plain' })
  };
  constructor( private http:HttpClient,public router:Router) { }

  getAllUserByLimit(skip,limit,authToken?):Observable<any>{
    let skipData = skip?  skip : 0;
    let limitData = limit?  limit : 0;
    return this.http.get<any>(Base_URL+'getAllUserByLimit?skip='+skipData+'&limit='+limitData+'&authToken='+authToken)
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
