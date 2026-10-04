import { NuevoProducto, Producto } from '../../../../domain/models/producto.model';
import { ProductEntity } from '../models/product.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Producto {
    return {
      id: entity.id,
      nombre: entity.name,
      tipo: entity.type,
      categoria: entity.category,
      precio: entity.price,
      unidad: entity.unit,
      cantidad: entity.stock,
      ubicacion: entity.location,
      vendedor: entity.seller,
      emoji: entity.emoji,
      descripcion: entity.description,
    };
  }

  static toEntity(producto: NuevoProducto, id: string): ProductEntity {
    return {
      id,
      name: producto.nombre,
      type: producto.tipo,
      category: producto.categoria,
      price: producto.precio,
      unit: producto.unidad,
      stock: producto.cantidad,
      location: producto.ubicacion,
      seller: producto.vendedor,
      emoji: producto.emoji,
      description: producto.descripcion,
    };
  }
}
