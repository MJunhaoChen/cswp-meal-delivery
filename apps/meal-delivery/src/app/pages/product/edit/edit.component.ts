import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Alert, AlertService } from '../../../shared/alert/alert.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

export enum AllergyTypesEnum {
  gerst = 'gerst',
  gluten = 'gluten',
  mais = 'mais',
  peulvruchten = 'peulvruchten',
  soja = 'soja',
  tarwe = 'tarwe',
  wortel = 'wortel',
}

@Component({
  selector: 'product-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  componentId: string | null | undefined;
  componentExists: boolean = false;
  product: Product | undefined;
  productid!: number | undefined;
  debug = false;
  public allergyTypes = Object.values(AllergyTypesEnum);

  subscriptionOptions!: Subscription;
  subscriptionParams!: Subscription;
  subscriptionStudios!: Subscription;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.subscriptionParams = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.componentId = params.get('id');
          if (!params.get('id')) {
            this.componentExists = false;
            return of({
              name: '',
              allergies: [],
              containsAlcohol: false,
            } as unknown as Product);
          } else {
            this.componentExists = true;
            return this.productService.getProductById(params.get('id')!);
          }
        }),
        tap(console.log)
      )
      .subscribe((product: Product) => {
        this.product = product;
      });
  }

  addAllergy() {
    this.product!.allergies!.push('');
  }

  onSubmit() {
    console.log('onSubmit', this.product);

    if (this.product) {
      const noEmptyStringAllergies = this.product.allergies!.filter(
        (allergy) => {
          return allergy !== '';
        }
      );
      const uniqueAllergies = noEmptyStringAllergies.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      this.product!.allergies = uniqueAllergies;
    }

    if (this.product!.id) {
      // A product with id must have been saved before, so it must be an update.
      this.productService
        .updateProduct(this.product!)
        .pipe(
          catchError((error: Alert) => {
            console.log(error);
            this.alertService.error(error.message);
            return of(false);
          })
        )
        .subscribe((success) => {
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        });
    } else {
      // A product without id has not been saved to the database before.
      this.productService
        .addProduct(this.product!)
        .pipe(
          catchError((error: Alert) => {
            console.log(error);
            this.alertService.error(error.message);
            return of(false);
          })
        )
        .subscribe((success) => {
          console.log(success);
          if (success) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (
      this.subscriptionOptions &&
      this.subscriptionParams &&
      this.subscriptionStudios
    ) {
      this.subscriptionOptions.unsubscribe();
      this.subscriptionParams.unsubscribe();
      this.subscriptionStudios.unsubscribe();
    }
  }
}
