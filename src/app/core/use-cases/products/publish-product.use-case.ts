import { Injectable } from '@angular/core';
import { NuevoProducto } from '../../domain/models/producto.model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class PublishProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(producto: NuevoProducto) {
    return this.repository.create(producto);
  }
}
