import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'product-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  product$!: Observable<Product | null | undefined>;
  isStudent: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productService.getProductById(params.get('id')!)
      )
    );
    this.isStudent = this.authService.checkIsStudent();
  }
}
