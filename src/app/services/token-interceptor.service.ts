import { Injectable } from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';
import {AuthService} from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(public auth:AuthService) { }

  intercept(req,next){
    let _token=this.auth.getFromLocalStore('_token');
    let tokenizedReq = req.clone({
      setHeaders:{
        authToken:_token
      }
    })
    return next.handle(tokenizedReq);
  }
}
