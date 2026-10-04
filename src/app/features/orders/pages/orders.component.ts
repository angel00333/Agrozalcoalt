import { Component, inject, OnInit, signal } from '@angular/core';
import { Pedido } from '../../../core/domain/models/pedido.model';
import { GetOrdersUseCase } from '../../../core/use-cases/orders/get-orders.use-case';

@Component({
  selector: 'app-orders',
  template: `
    <h1 class="text-xl font-bold">Mis pedidos</h1>
    <div class="mt-4 space-y-3">
      @for (o of pedidos(); track o.id) {
        <div class="bg-white rounded-2xl p-4 border flex justify-between items-center gap-3">
          <div class="flex gap-3 items-center min-w-0">
            <span class="material-icons-round text-brand">inventory_2</span>
            <div class="min-w-0">
              <p class="font-semibold truncate">{{ o.producto }}</p>
              <p class="text-xs text-stone-500">{{ o.id }} · {{ o.cantidad }} · {{ o.fecha }}</p>
            </div>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full whitespace-nowrap"
            [class]="o.estado === 'Entregado' ? 'bg-green-100 text-green-800' : o.estado === 'En camino' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'"
          >
            {{ o.estado }}
          </span>
        </div>
      }
    </div>
  `,
})
export class OrdersPageComponent implements OnInit {
  private readonly getOrders = inject(GetOrdersUseCase);
  readonly pedidos = signal<Pedido[]>([]);

  async ngOnInit() {
    this.pedidos.set(await this.getOrders.execute());
  }
}
