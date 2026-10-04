import { Injectable } from '@angular/core';
import { NuevoProducto, Producto, TipoProducto } from '../../../../domain/models/producto.model';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { CATEGORIES, PRODUCT_ENTITIES } from '../data/mock-data';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products = [...PRODUCT_ENTITIES];

  async getAll(tipo?: TipoProducto): Promise<Producto[]> {
    return this.products
      .filter((item) => !tipo || item.type === tipo)
      .map(ProductMapper.toDomain);
  }

  async getById(id: string): Promise<Producto | null> {
    const entity = this.products.find((item) => item.id === id);
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async getCategories(): Promise<string[]> {
    return [...CATEGORIES];
  }

  async create(producto: NuevoProducto): Promise<Producto> {
    const id = String(Date.now());
    const entity = ProductMapper.toEntity(producto, id);
    this.products.unshift(entity);
    return ProductMapper.toDomain(entity);
  }
}
