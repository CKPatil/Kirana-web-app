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
  orderType;
  getUpdateOrderStatusURL: string;
  buildURLS(param: string) {
    this.getAllTransactionsURL = environment.backend_end_point + environment.orders+param;
  }

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access');
    this.httpOptions = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token});
  }

  getAllOrders() {
    console.log(this.httpOptions);
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

  fetchUpdateOrderStatusURL(id: number, status: number){
    this.getUpdateOrderStatusURL = environment.backend_end_point + environment.updateStatusURL + '?order_id=' + id + '&status=' + status;
    debugger;
  }

  updateOrderStatus(id: number, status: number){
    this.fetchUpdateOrderStatusURL(id,status);
    console.log(this.httpOptions);
    debugger;
    return this.http.put(this.getUpdateOrderStatusURL,{},{ 
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
