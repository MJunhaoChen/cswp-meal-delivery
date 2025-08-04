import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo, UserRegister } from '@md/data';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  subs!: Subscription;
  formData: UserRegister;

  constructor(public authService: AuthService, private router: Router) {}

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
      emailAddress: '',
      isGraduated: false,
      role: 'student',
    };
  }

  onSubmit(): void {
    this.authService
      .register(this.formData)
      .subscribe((user: UserInfo | undefined) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }
}
