import { Pedido } from '../models/pedido.model';

export abstract class OrderRepository {
  abstract getAll(): Promise<Pedido[]>;
}
