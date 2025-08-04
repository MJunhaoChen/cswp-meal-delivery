import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdentity, UserInfo, UserLogin } from '@md/data';
import { Subscription } from 'rxjs';
import { AlertService } from '../../shared/alert/alert.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subs!: Subscription;
  formData: UserLogin;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.subs = this.authService
      .getUserFromLocalStorage()
      .subscribe((user: UserInfo | undefined) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
    this.formData = {
      username: '',
      password: '',
    };
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    const { username, password } = this.formData;
    if (!username || !password) {
      return;
    }

    this.authService
      .login(this.formData)
      .subscribe((user: UserIdentity | undefined) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }
}
