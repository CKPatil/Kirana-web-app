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
  httpOptions: any;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  buildURLS() {
    this.NotificationURL = environment.backend_end_point + environment.notification;
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
}
