import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";

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
  }

  buildURLS() {
    this.getAllRetailerURL =
      environment.backend_end_point + environment.retailers;
  }

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
