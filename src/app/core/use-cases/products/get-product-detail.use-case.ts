import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductDetailUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string) {
    return this.repository.getById(id);
  }
}
