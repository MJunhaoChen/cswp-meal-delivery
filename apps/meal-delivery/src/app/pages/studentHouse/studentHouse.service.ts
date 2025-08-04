import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '@md/data';
import { StudentHouse } from './studentHouse.model';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { AlertService } from '../../shared/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class StudentHouseService {
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

  getAllStudentHouses(): Observable<StudentHouse[] | null | undefined> {
    return this.http
      .get<ApiResponse<StudentHouse[]>>(
        `${this.siteEndpoint}/studentHouse`,
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

  getStudentHouseById(id: string): Observable<StudentHouse | null | undefined> {
    return this.http
      .get<StudentHouse>(
        `${this.siteEndpoint}/studentHouse/${id}`,
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

  addStudentHouse(newStudentHouse: StudentHouse) {
    return this.http
      .post<StudentHouse>(
        `${this.siteEndpoint}/studentHouse`,
        newStudentHouse,
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

  updateStudentHouse(updatedStudentHouse: StudentHouse) {
    return this.http
      .put<StudentHouse>(
        `${this.siteEndpoint}/studentHouse/${updatedStudentHouse.id}`,
        updatedStudentHouse,
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

  deleteStudentHouse(id: string) {
    return this.http
      .delete<StudentHouse>(
        `${this.siteEndpoint}/studentHouse/${id}`,
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
}
