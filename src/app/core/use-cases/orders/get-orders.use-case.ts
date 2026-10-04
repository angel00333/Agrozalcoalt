import { Injectable } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';

@Injectable({ providedIn: 'root' })
export class GetOrdersUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute() {
    return this.repository.getAll();
  }
}
