import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  selectedCategoryId = 1;

  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY; // of([]);
    })
  );

  productsSimpleFilter$ = this.productService.productsWithCategory$
  .pipe(
    map(products => 
      products.filter(product =>
        this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
    ))
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
    this.selectedCategoryId = +categoryId; // conversion to number
  }
}
