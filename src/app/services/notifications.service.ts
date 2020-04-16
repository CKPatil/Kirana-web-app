import { Notifications } from './../models/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  newNotificationURL: string;
  cancelNotificationURL: string;
  criticalNotificationURL: string;
  httpOptions: any;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  buildURLS() {
    this.newNotificationURL = environment.backend_end_point + environment.notification;
    this.criticalNotificationURL = environment.backend_end_point + environment.notification;
    this.cancelNotificationURL = environment.backend_end_point + environment.notification;
  }
  getAllNewNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(this.newNotificationURL, {
      headers: this.httpOptions
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  getAllCancelledNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(this.cancelNotificationURL, {
      headers: this.httpOptions
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  getAllCriticalNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(this.criticalNotificationURL, {
      headers: this.httpOptions
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
