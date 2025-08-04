import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IToken } from '@md/data';
import { AuthService } from './auth.service';
import { ModalLeaveYesNoComponent } from './modal/modal.leave-yes-no.component';

// Verifies that user is logged in before navigating to routes.
@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user: IToken | undefined) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}

@Injectable()
export class OwnerGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user: IToken | undefined) => {
        if (user) {
          let loggedIn = this.authService.decodeJwtToken(user.token) as any;
          if (loggedIn.role === 'owner') {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        } else {
          this.router.navigate(['login']);
          return false;
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}

@Injectable()
export class SaveEditedWorkGuard {
  constructor(private modalService: NgbModal) {}

  canDeactivate(): Promise<boolean> {
    return this.modalService
      .open(ModalLeaveYesNoComponent)
      .result.then(() => true)
      .catch(() => false);
  }
}
