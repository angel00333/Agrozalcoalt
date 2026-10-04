import { NuevoProducto, Producto, TipoProducto } from '../models/producto.model';

export abstract class ProductRepository {
  abstract getAll(tipo?: TipoProducto): Promise<Producto[]>;
  abstract getById(id: string): Promise<Producto | null>;
  abstract getCategories(): Promise<string[]>;
  abstract create(producto: NuevoProducto): Promise<Producto>;
}
