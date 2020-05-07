import { Transaction } from "./../models/models";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";
import { Observable, BehaviorSubject } from "rxjs";
import { transactions } from "../constants/mockup-data";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  getAllTransactionsURL: any;
  // tempURL: any;
  httpOptions;
  // orderType;
  // getUpdateOrderStatusURL: string;
  buildURLS() {
    this.getAllTransactionsURL =
      environment.backend_end_point + environment.orders;
  }

  constructor(private http: HttpClient) {
    this.buildURLS();

    // for Observer
    this.allOrders = new Array();
    this.observeOrders = new BehaviorSubject(this.allOrders);
  }

  refreshHttpOptions() {
    const token = localStorage.getItem("access");
    this.httpOptions = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
  }

  // getAllOrders(): Observable<Transaction[]> {
  //   return this.http
  //     .get<Transaction[]>(this.getAllTransactionsURL, {
  //       headers: this.httpOptions,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         return throwError(error);
  //       })
  //     );
  // }
  // getNextOrders(id) {
  //   return this.http
  //     .post(this.getAllTransactionsURL, JSON.stringify(id), {
  //       headers: this.httpOptions,
  //       observe: "response",
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         return throwError(error);
  //       })
  //     );
  // }

  // getAllTransactions() {
  //   return transactions;
  // }

  updateOrderStatus(orderId, orderStatusCode) {
    this.refreshHttpOptions();
    let updateURL =
      environment.backend_end_point +
      environment.order +
      `?order_id=${orderId}&status=${orderStatusCode}`;
    return this.http
      .put(
        updateURL,
        {},
        {
          headers: this.httpOptions,
          observe: "response",
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // ////////////// NEW CODE
  allOrders;
  observeOrders;

  eventChange() {
    this.observeOrders.next(this.allOrders);
  }

  getOrdersFromServer() {
    this.refreshHttpOptions();
    this.http
      .get(this.getAllTransactionsURL, {
        headers: this.httpOptions,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          this.allOrders = response;
          this.allOrders = this.allOrders.reverse();
          this.eventChange();
        },
        (error) => {
          console.log("Error");
        }
      );
  }

  readNotification(orderId) {
    const getReadNotification = environment.backend_end_point
          + environment.readNotification + `/?order_id=${orderId}`;
    this.refreshHttpOptions();
    return this.http
    .get(getReadNotification, {
      headers: this.httpOptions,
    })
    .pipe(
      catchError((error) => {
        return throwError(error);
      })
    );

  }
  readAllNotifications(status) {
    const getAllNotifications = environment.backend_end_point + environment.readAllNotifications +
    `/?status=${status}`;
    this.refreshHttpOptions();
    return this.http
    .get(getAllNotifications, {
      headers: this.httpOptions,
    })
    .pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  // ///////////// END NEW CODE
}
