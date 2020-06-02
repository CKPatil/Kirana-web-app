import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService, private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=localStorage.getItem("access");

    if(token){
      request=request.clone({
        setHeaders:{
          "access":token
        }
      })
    }

    return next.handle(request).pipe(catchError(err=>{
      
      if(err.status === 401){
        if(err.error.messages[0].message == "Token is invalid or expired") {
          let param={
            refresh:localStorage.getItem("refresh")
          }
          return this.authService.refreshToken(param).subscribe(data=>{
            let token1=data.body["access"];
            localStorage.setItem("access",token1);
            request=request.clone({
              setHeaders:{
                "access":token1
              }
            });
            return next.handle(request).pipe(catchError(err=>{
              console.log(err);
              throwError(err);
            }))        
          })
        }else{
          localStorage.clear();
          // window.location.reload();
          this._router.navigate(['/login']);
        }
      } else {
        localStorage.clear();
        // window.location.reload();
        this._router.navigate(['/login']);
        return throwError(err);
      }

      return throwError(err);
    }));
  }
}
