export type EstadoPedido = 'Pendiente' | 'En camino' | 'Entregado';

export interface Pedido {
  id: string;
  producto: string;
  cantidad: string;
  estado: EstadoPedido;
  fecha: string;
}
