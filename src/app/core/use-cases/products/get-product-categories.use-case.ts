import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductCategoriesUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute() {
    return this.repository.getCategories();
  }
}
