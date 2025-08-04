import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@md/data';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  @Input() title!: string;
  isNavbarCollapsed = true;
  loggedInUser$!: Observable<IToken | undefined>;
  isAdmin: boolean;
  isStudent: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUser$ = this.authService.currentUser$;
    this.isAdmin = this.authService.checkIsAdmin();
    this.isStudent = this.authService.checkIsStudent();
  }

  logout(): void {
    this.authService.logout();
  }
}
