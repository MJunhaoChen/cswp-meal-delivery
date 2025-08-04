import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '@md/data';
import { User } from './user.model';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { AlertService } from '../../shared/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private siteEndpoint: string;

  constructor(
    private http: HttpClient,
    public configService: ConfigService,
    public alertService: AlertService
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
    } else if (message.includes('duplicate key')) {
      message =
        'Gebruikersnaam of e-mailadres ongeldig omdat gebruiker al bestaat.';
    } else if (message === 'Forbidden resource') {
      message = 'Je hebt geen toegang om deze functie te gebruiken.';
    }

    this.alertService.error(message);
  }

  getAllUsers(): Observable<User[] | null | undefined> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.siteEndpoint}/user`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  getUserById(id: string): Observable<User | null | undefined> {
    return this.http
      .get<User>(`${this.siteEndpoint}/user/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  addUser(newUser: User) {
    return this.http
      .post<User>(`${this.siteEndpoint}/user`, newUser, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }

  updateUser(updatedUser: User) {
    return this.http
      .put<User>(
        `${this.siteEndpoint}/user/${updatedUser.id}`,
        updatedUser,
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

  deleteUser(id: string) {
    return this.http
      .delete<User>(`${this.siteEndpoint}/user/${id}`, this.httpOptions)
      .pipe(
        map((data: any) => data.results),
        catchError((e) => {
          this.handleHttpError(e);
          return of(undefined);
        })
      );
  }
}
