import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Alert, AlertService } from '../../../shared/alert/alert.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  componentId: string | null | undefined;
  componentExists: boolean = false;
  user: User | undefined;
  userid!: number | undefined;
  debug = false;

  subscriptionOptions!: Subscription;
  subscriptionParams!: Subscription;
  subscriptionStudios!: Subscription;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptionParams = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.componentId = params.get('id');
          if (!params.get('id')) {
            this.componentExists = false;
            return of({} as User);
          } else {
            this.componentExists = true;
            return this.userService.getUserById(params.get('id')!);
          }
        }),
        tap(console.log)
      )
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  onSubmit() {
    console.log('onSubmit', this.user);

    if (this.user!.id) {
      // A user with id must have been saved before, so it must be an update.
      this.userService
        .updateUser(this.user!)
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
      // A user without id has not been saved to the database before.
      this.userService
        .addUser(this.user!)
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
