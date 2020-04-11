import { Transaction } from './../models/models';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { transactions } from '../constants/mockup-data';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  getAllTransactionsURL: any;
  tempURL: any;
  httpOptions;
  buildURLS() {
    this.getAllTransactionsURL = environment.backend_end_point + environment.orders;
  }

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  getAllOrders(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.getAllTransactionsURL,  {
      headers: this.httpOptions,
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  getNextOrders(id) {
    return this.http
      .post(this.getAllTransactionsURL, JSON.stringify(id), {
        headers: this.httpOptions,
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  getAllTransactions() {
    return transactions;
  }
}
