import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'user-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  user$!: Observable<User | null | undefined>;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.getUserById(params.get('id')!)
      )
    );
    this.isAdmin = this.authService.checkIsAdmin();
  }
}
