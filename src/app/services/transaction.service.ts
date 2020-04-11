import { Injectable } from '@angular/core';
import { transactions } from '../constants/mockup-data';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  getAllTransactionsURL: any;
  httpOptions;
  buildURLS() {
    this.getAllTransactionsURL = environment.backend_end_point + environment.orders;
  }

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
    this.buildURLS();
  }

  getAllOrders() {
    return this.http.get(this.getAllTransactionsURL,  {
      headers: this.httpOptions,
      observe: 'response'
    })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getAllTransactions() {
    return transactions;
  }
}
