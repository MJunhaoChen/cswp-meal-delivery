import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Alert, AlertService } from '../../../shared/alert/alert.service';
import { StudentHouse } from '../studentHouse.model';
import { StudentHouseService } from '../studentHouse.service';

export enum AllergyTypesEnum {
  gerst = 'gerst',
  gluten = 'gluten',
  mais = 'mais',
  peulvruchten = 'peulvruchten',
  soja = 'soja',
  tarwe = 'tarwe',
  wortel = 'wortel',
}

@Component({
  selector: 'studentHouse-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  componentId: string | null | undefined;
  componentExists: boolean = false;
  studentHouse: StudentHouse | undefined;
  studentHouseid!: number | undefined;
  debug = false;
  public allergyTypes = Object.values(AllergyTypesEnum);

  subscriptionOptions!: Subscription;
  subscriptionParams!: Subscription;
  subscriptionStudios!: Subscription;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private studentHouseService: StudentHouseService
  ) {}

  ngOnInit(): void {
    this.subscriptionParams = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.componentId = params.get('id');
          if (!params.get('id')) {
            this.componentExists = false;
            return of({} as StudentHouse);
          } else {
            this.componentExists = true;
            return this.studentHouseService.getStudentHouseById(
              params.get('id')!
            );
          }
        }),
        tap(console.log)
      )
      .subscribe((studentHouse: StudentHouse) => {
        this.studentHouse = studentHouse;
      });
  }

  onSubmit() {
    if (this.studentHouse!.id) {
      // A studentHouse with id must have been saved before, so it must be an update.
      this.studentHouseService
        .updateStudentHouse(this.studentHouse!)
        .pipe(
          catchError((error: Alert) => {
            console.log(error);
            this.alertService.error(error.message);
            return of(false);
          })
        )
        .subscribe((success) => {
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        });
    } else {
      // A studentHouse without id has not been saved to the database before.
      this.studentHouseService
        .addStudentHouse(this.studentHouse!)
        .pipe(
          catchError((error: Alert) => {
            console.log(error);
            this.alertService.error(error.message);
            return of(false);
          })
        )
        .subscribe((success) => {
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (
      this.subscriptionOptions &&
      this.subscriptionParams &&
      this.subscriptionStudios
    ) {
      this.subscriptionOptions.unsubscribe();
      this.subscriptionParams.unsubscribe();
      this.subscriptionStudios.unsubscribe();
    }
  }
}
