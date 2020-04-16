import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, pipe } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  productsURL: string;
  httpOptions: any;
  tempURL: string;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  buildURLS() {
    this.productsURL = environment.backend_end_point + environment.resetPassURL;
  }
  addNewPassword(data): Observable<any> {
    return this.http.put(this.productsURL, JSON.stringify(data), {
      headers: this.httpOptions,
      observe: 'response'
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
