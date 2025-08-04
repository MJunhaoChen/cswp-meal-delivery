import { Component, OnInit } from '@angular/core';
import { SaveEditedWorkGuard } from '../../../auth/auth.guards';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { MealService } from '../meal.service';

@Component({
  selector: 'meal-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
})
export class OrderListComponent implements OnInit {
  user;
  isOwner: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  currentUserId: string;

  constructor(
    private userService: UserService,
    private mealService: MealService,
    private saveEditedWorkGuard: SaveEditedWorkGuard,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isOwner = this.authService.checkIsOwner();
    this.isAdmin = this.authService.checkIsAdmin();
    this.isStudent = this.authService.checkIsStudent();
    this.currentUserId = this.authService.getCurrentUserId() || '';
    this.userService.getUserById(this.currentUserId).subscribe((data) => {
      this.user = data;
    });
  }

  cancelOrder(id: string) {
    this.saveEditedWorkGuard.canDeactivate().then((result) => {
      if (result) {
        this.mealService.cancelOrder(id).subscribe(() => {
          this.userService.getUserById(this.currentUserId).subscribe((data) => {
            this.user = data;
          });
        });
      }
    });
  }
}
