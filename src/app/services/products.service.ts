import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  productsURL: string;
  imageUploadURL: string;
  httpOptions: any;
  tempURL: string;
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

  uploadImage(data) {
    const token = localStorage.getItem("access");
    return this.http.post(this.imageUploadURL, data, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
      observe: "response",
    });
  }

  deleteProduct(id: number): Observable<any> {
    // return this.http.delete<DeleteItems>(this.productsURL)
  console.log(this.productsURL + '?id=' + id);
  return this.http.delete(this.productsURL + '?id=' + id, { responseType: 'text' })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
