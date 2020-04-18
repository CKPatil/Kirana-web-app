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

  NotificationURL: string;
  InviteURL: string;
  httpOptions: any;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  buildURLS() {
    this.NotificationURL = environment.backend_end_point + environment.notification;
    this.InviteURL = environment.backend_end_point + environment.inviteURL;
  }
  getAllNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(this.NotificationURL, {
      headers: this.httpOptions
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getInviteNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.InviteURL, {
      headers: this.httpOptions
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
