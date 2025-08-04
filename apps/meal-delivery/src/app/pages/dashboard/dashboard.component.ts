import { Component, OnInit } from '@angular/core';
import { IToken } from '@md/data';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  apiUrl = '';
  loggedInUser$!: Observable<IToken | undefined>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUser$ = this.authService.currentUser$;
    this.apiUrl = environment.SERVER_API_URL;
  }
}
