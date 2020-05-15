import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  productsURL: string;
  imageUploadURL: string;
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
    this.productsURL = environment.backend_end_point + environment.products;
    this.imageUploadURL =
      environment.backend_end_point + environment.imageUpload;
  }

  // get all products list
  getAllProducts() {
    return this.http
      .get(this.productsURL, {
        headers: this.httpOptions,
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // add a particular new product
  addProduct(data) {
    return this.http
      .post(this.productsURL, JSON.stringify(data), {
        headers: this.httpOptions,
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // upload a new image
  uploadImage(data) {
    const token = localStorage.getItem("access");
    return this.http
      .post(this.imageUploadURL, data, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // delete a particular product
  deleteProduct(data) {
    return this.http
      .delete(this.productsURL + data, {
        headers: this.httpOptions,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // update a particular new product
  updateProduct(data, query) {
    return this.http
      .put(this.productsURL + query, data, {
        headers: this.httpOptions,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // disable a particular variant
  toogleDisableVariant(productId: number, status: number) {
    const URL =
      environment.backend_end_point +
      environment.disableVariant +
      `?id=${productId}&status=${status}`;

    return this.http
      .put(
        URL,
        {},
        {
          headers: this.httpOptions,
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
