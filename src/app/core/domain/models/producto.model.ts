export type TipoProducto = 'cosecha' | 'insumo';

export interface Producto {
  id: string;
  nombre: string;
  tipo: TipoProducto;
  categoria: string;
  precio: number;
  unidad: string;
  cantidad: number;
  ubicacion: string;
  vendedor: string;
  emoji: string;
  descripcion: string;
}

export type NuevoProducto = Omit<Producto, 'id'>;
