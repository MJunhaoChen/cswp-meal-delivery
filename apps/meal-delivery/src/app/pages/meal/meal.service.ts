import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ApiResponse } from '@md/data';
import { AddProductIds, Meal, RemoveProductIds } from './meal.model';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { AlertService } from '../../shared/alert/alert.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private readonly siteEndpoint: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private configService: ConfigService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.siteEndpoint = `${this.configService.getConfig().apiEndpoint}api`;
  }

  private handleHttpError(error: any) {
    let message = error.message;

    if (error?.error?.message) {
      message = error.error.message;
    }

    if (message.includes('Http failure response for')) {
      message = 'Kan geen verbinding maken met de database.';
    } else if (message === 'You are not the owner of this meal.') {
      message = 'U bent niet de eigenaar van deze maaltijd.';
    } else if (message === 'Forbidden resource') {
      message = 'Je hebt geen toegang om deze functie te gebruiken.';
    }

    this.alertService.error(message);
  }

  getAllMeals() {
    return this.http
      .get<ApiResponse<Meal[]>>(`${this.siteEndpoint}/meal`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  getMealById(id: string): Observable<Meal | null | undefined> {
    return this.http
      .get<Meal>(`${this.siteEndpoint}/meal/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => {
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  addMeal(newMeal: Meal) {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      return this.userService.getUserById(userId).pipe(
        switchMap((data) => {
          newMeal.owner = data?.username;
          return this.http.post<Meal>(
            `${this.siteEndpoint}/meal`,
            newMeal,
            this.httpOptions
          );
        }),
        map((data: any) => {
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
    } else {
      return throwError('UserId bestaat niet');
    }
  }

  updateMeal(updatedMeal: Meal) {
    return this.http
      .put<Meal>(
        `${this.siteEndpoint}/meal/${updatedMeal.id}`,
        updatedMeal,
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

  orderMeal(id: string) {
    return this.http
      .post<Meal>(`${this.siteEndpoint}/orderlist/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => {
          this.alertService.success('Maaltijd succesvol besteld.');
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  cancelOrder(id: string) {
    return this.http
      .delete<Meal>(`${this.siteEndpoint}/orderlist/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => {
          this.alertService.success('Maaltijd succesvol geannuleerd.');
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  addProductToMeal(ids: AddProductIds) {
    return this.http
      .post<AddProductIds>(
        `${this.siteEndpoint}/productlist`,
        ids,
        this.httpOptions
      )
      .pipe(
        map((data: any) => {
          this.alertService.success('Product succesvol toegevoegd.');
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  removeProductFromMeal(productIds: string[], id: string) {
    const params = new HttpParams().set('productIds', [productIds].join(','));
    return this.http
      .delete<RemoveProductIds>(`${this.siteEndpoint}/productlist/${id}`, {
        ...this.httpOptions,
        params,
      })
      .pipe(
        map((data: any) => {
          this.alertService.success('Product succesvol eruit gehaald.');
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  deleteMeal(id: string) {
    return this.http
      .delete<Meal>(`${this.siteEndpoint}/meal/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => {
          return data.results;
        }),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }
}
