import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public LoginData: any;
  private httpOptions = new HttpHeaders({ 'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
    // setInterval(() => {
    //   console.log('called');
    //   const refreshToken = localStorage.getItem('refresh');
    //   this.refreshToken({refresh: refreshToken}).subscribe((res) => {
    //     console.log(res);
    //   }); }, 1000 * 60 * 0.1);
  }

  signUp(data) {
    const url = environment.backend_end_point + environment.signUpURL;

    return this.http
      .post(url, JSON.stringify(data), {
        headers: this.httpOptions,
        observe: 'response'
      })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  refreshToken(data) {
    const url = environment.backend_end_point + environment.refreshURL;
    return this.http
      .post(url, JSON.stringify(data), {
        headers: this.httpOptions,
        observe: 'response'
      })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  login(data) {
    const url = environment.backend_end_point + environment.tokenURL;
    return this.http
      .post(url, JSON.stringify(data), {
        headers: this.httpOptions,
        observe: 'response'
      })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  // forgotPassword(data) {
  //   var url = environment.api_Base_URL + environment.forgotPassword;
  //   var body = JSON.stringify(data);

  //   return this.http
  //     .post(url, body, { headers: this.httpOptions, observe: 'response' })
  //     .pipe(
  //       catchError(error => {
  //         return throwError(error);
  //       })
  //     );
  // }

  // resetPassword(data, token) {
  //   var url = environment.api_Base_URL + environment.resetPassword;
  //   var body = JSON.stringify(data);
  //   localStorage.setItem('token', token);
  //   return this.http
  //     .post(url, body, { headers: this.httpOptions, observe: 'response' })
  //     .pipe(
  //       catchError(error => {
  //         return throwError(error);
  //       })
  //     );
  // }

  loggedIn() {
    return !!localStorage.getItem('user');
  }

  setLoginData(data) {
    this.LoginData = data;
  }

  getLoginData() {
    if (this.LoginData) {
      return this.LoginData;
    }
  }

}
