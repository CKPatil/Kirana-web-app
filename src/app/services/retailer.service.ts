import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RetailerService {
  getAllRetailerURL: string;
  httpOptions: any;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem("access");
    this.httpOptions = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
    this.buildURLS();

    // FOR Observable
    this.allInviteRequests = new Array();
    this.observeInviteRequests = new BehaviorSubject(this.allInviteRequests);
  }

  buildURLS() {
    this.getAllRetailerURL =
      environment.backend_end_point + environment.retailers;
  }

  // to get all the retailers
  getAllRetailers() {
    return this.http
      .get(this.getAllRetailerURL, {
        headers: this.httpOptions,
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // to get the invitation requests from the server
  getAllInvitationRequests() {
    let inviteUrl = environment.backend_end_point + environment.inviteURL;
    return this.http
      .get(inviteUrl, {
        headers: this.httpOptions,
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // //////////////// NEW CODE

  allInviteRequests;
  observeInviteRequests;

  // to get the invite request from the server and save to observable
  getAllInvitationRequestsFromServer() {
    let inviteUrl = environment.backend_end_point + environment.inviteURL;
    this.http
      .get(inviteUrl, {
        headers: this.httpOptions,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          this.allInviteRequests = response;
          this.eventChange();
        },
        (error) => {
          console.log("Error");
        }
      );
  }

  eventChange() {
    this.observeInviteRequests.next(this.allInviteRequests);
  }

  // ////////////// END NEW CODE

  inviteRequestResponse(data) {
    let inviteRespnseUrl =
      environment.backend_end_point + environment.inviteResponseURL;
    return this.http
      .put(inviteRespnseUrl, data, {
        headers: this.httpOptions,
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
