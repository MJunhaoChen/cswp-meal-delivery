import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveEditedWorkGuard } from '../../../auth/auth.guards';
import { AuthService } from '../../../auth/auth.service';
import { Meal } from '../meal.model';
import { MealService } from '../meal.service';

@Component({
  selector: 'meal-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  meals$!: Observable<Meal[] | null | undefined>;
  isOwner: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  currentUserId: string;
  showNoMealsMessage = true;

  constructor(
    private mealService: MealService,
    private saveEditedWorkGuard: SaveEditedWorkGuard,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.meals$ = this.mealService.getAllMeals();
    this.meals$.subscribe((meals) => {
      for (let meal of meals!) {
        if (meal.ownerRef!.id === this.currentUserId) {
          this.showNoMealsMessage = false;
          break;
        }
      }
    });
    this.isOwner = this.authService.checkIsOwner();
    this.isAdmin = this.authService.checkIsAdmin();
    this.isStudent = this.authService.checkIsStudent();
    this.currentUserId = this.authService.getCurrentUserId() || '';
  }

  orderMeal(id: string) {
    this.mealService.orderMeal(id).subscribe(() => {
      this.meals$ = this.mealService.getAllMeals();
    });
  }

  deleteMeal(id: string) {
    this.saveEditedWorkGuard.canDeactivate().then((result) => {
      if (result) {
        this.mealService.deleteMeal(id).subscribe(() => {
          this.meals$ = this.mealService.getAllMeals();
        });
      }
    });
  }
}
