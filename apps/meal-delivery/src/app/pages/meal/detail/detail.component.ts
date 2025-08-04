import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Meal } from '../meal.model';
import { MealService } from '../meal.service';

@Component({
  selector: 'meal-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  meal$!: Observable<Meal | null | undefined>;
  isStudent: boolean;

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.meal$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.mealService.getMealById(params.get('id')!)
      )
    );
    this.isStudent = this.authService.checkIsStudent();
  }

  toDecimal(price: number | undefined) {
    return price?.toLocaleString('es-ES', { minimumFractionDigits: 2 });
  }
}
