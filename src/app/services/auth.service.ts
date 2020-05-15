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

  constructor(private http: HttpClient) {}

  // signup service
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

  // refresh token service
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

  // login service
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

  // forgot password on login page
  forgotPassword(data, param) {
    const url = environment.backend_end_point + environment.forgotPassword + param;

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

  // OTP req
  sendOTP(data, param) {
    const url = environment.backend_end_point + environment.forgotPassword + param;

    return this.http
      .put(url, JSON.stringify(data), {
        headers: this.httpOptions,
      })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  // update new password
  updatePassword(data, param) {
    const url = environment.backend_end_point + environment.updatePassword + param;

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

  // receive login data
  loggedIn() {
    return !!localStorage.getItem('user');
  }

  // set login data
  setLoginData(data) {
    this.LoginData = data;
  }

  // get login data
  getLoginData() {
    if (this.LoginData) {
      return this.LoginData;
    }
  }

}
