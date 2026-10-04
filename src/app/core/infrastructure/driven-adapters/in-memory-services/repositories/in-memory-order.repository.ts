import { Injectable } from '@angular/core';
import { Pedido } from '../../../../domain/models/pedido.model';
import { OrderRepository } from '../../../../domain/repositories/order.repository';
import { ORDER_ENTITIES } from '../data/mock-data';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  async getAll(): Promise<Pedido[]> {
    return ORDER_ENTITIES.map((order) => ({ ...order }));
  }
}
