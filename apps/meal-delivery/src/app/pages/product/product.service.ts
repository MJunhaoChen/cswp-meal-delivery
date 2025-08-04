import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '@md/data';
import { Product } from './product.model';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { AlertService } from '../../shared/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private siteEndpoint: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private alertService: AlertService
  ) {
    this.siteEndpoint = `${this.configService.getConfig().apiEndpoint}api`;
  }

  private handleHttpError(error: any) {
    let message = error.message;

    if (error?.error?.message) {
      message = error.error.message;
    }
    console.log(message);

    if (message.includes('Http failure response for')) {
      message = 'Kan geen verbinding maken met de database.';
    } else if (message === 'Forbidden resource') {
      message = 'Je hebt geen toegang om deze functie te gebruiken.';
    }

    this.alertService.error(message);
  }

  getAllProducts(): Observable<Product[] | null | undefined> {
    return this.http
      .get<ApiResponse<Product[]>>(
        `${this.siteEndpoint}/product`,
        this.httpOptions
      )
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  getProductById(id: string): Observable<Product | null | undefined> {
    return this.http
      .get<Product>(`${this.siteEndpoint}/product/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  addProduct(newProduct: Product) {
    return this.http
      .post<Product>(
        `${this.siteEndpoint}/product`,
        newProduct,
        this.httpOptions
      )
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  updateProduct(updatedProduct: Product) {
    return this.http
      .put<Product>(
        `${this.siteEndpoint}/product/${updatedProduct.id}`,
        updatedProduct,
        this.httpOptions
      )
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  deleteProduct(id: string) {
    return this.http
      .delete<Product>(`${this.siteEndpoint}/product/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }
}
