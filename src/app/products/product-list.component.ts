import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { combineLatest, EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
    .pipe(
      startWith(0)
    )
  ])
  .pipe(
    map(([products, selectedCategoryId]) =>
      products.filter( product => 
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
    )),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY; // of([]);
    })
  );


  categories$ = this.productCategoryService.productCategories$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  constructor(
    private productService: ProductService, 
    private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    // data stream doesn't react to this change, need to add Action stream
    this.categorySelectedSubject.next(+categoryId); // converting to number
  }
}
