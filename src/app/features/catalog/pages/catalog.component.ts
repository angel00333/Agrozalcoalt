import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto, TipoProducto } from '../../../core/domain/models/producto.model';
import { GetProductCategoriesUseCase } from '../../../core/use-cases/products/get-product-categories.use-case';
import { GetProductsUseCase } from '../../../core/use-cases/products/get-products.use-case';
import { ProductCardComponent } from '../../shared/components/product-card.component';

@Component({
  selector: 'app-catalog',
  imports: [ProductCardComponent],
  template: `
    <h1 class="text-xl font-bold">{{ tipo() === 'cosecha' ? 'Catálogo de cosechas' : 'Catálogo de insumos' }}</h1>

    <div class="relative mt-3">
      <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
      <input
        placeholder="Buscar..."
        (input)="q.set($any($event.target).value)"
        class="w-full rounded-xl border border-stone-300 p-3 pl-10 bg-white"
      />
    </div>

    <div class="flex gap-2 overflow-x-auto py-3">
      @for (c of categorias(); track c) {
        <button
          (click)="cat.set(c)"
          class="px-3 py-1 rounded-full text-sm whitespace-nowrap border"
          [class]="cat() === c ? 'bg-brand text-white border-brand' : 'bg-white border-stone-200'"
        >
          {{ c }}
        </button>
      }
    </div>

    <div class="space-y-3">
      @for (p of filtrados(); track p.id) {
        <app-product-card [p]="p" />
      } @empty {
        <p class="text-center text-stone-500 py-10">No se encontraron resultados.</p>
      }
    </div>
  `,
})
export class CatalogPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getProducts = inject(GetProductsUseCase);
  private readonly getCategories = inject(GetProductCategoriesUseCase);

  readonly tipo = signal<TipoProducto>('cosecha');
  readonly productos = signal<Producto[]>([]);
  readonly categorias = signal<string[]>(['Todas']);
  readonly q = signal('');
  readonly cat = signal('Todas');

  readonly filtrados = computed(() => {
    const query = this.q().trim().toLowerCase();
    return this.productos().filter((p) =>
      (this.cat() === 'Todas' || p.categoria === this.cat()) &&
      p.nombre.toLowerCase().includes(query)
    );
  });

  async ngOnInit() {
    this.tipo.set((this.route.snapshot.data['tipo'] as TipoProducto) ?? 'cosecha');
    const [products, categories] = await Promise.all([
      this.getProducts.execute(this.tipo()),
      this.getCategories.execute(),
    ]);
    this.productos.set(products);
    this.categorias.set(categories);
  }
}
