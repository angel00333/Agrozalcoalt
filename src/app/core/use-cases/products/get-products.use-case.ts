import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { TipoProducto } from '../../domain/models/producto.model';

@Injectable({ providedIn: 'root' })
export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(tipo?: TipoProducto) {
    return this.repository.getAll(tipo);
  }
}
