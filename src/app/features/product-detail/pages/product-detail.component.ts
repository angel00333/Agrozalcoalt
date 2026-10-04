import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../../core/domain/models/producto.model';
import { GetProductDetailUseCase } from '../../../core/use-cases/products/get-product-detail.use-case';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe],
  template: `
    @if (p(); as product) {
      <a [routerLink]="product.tipo === 'cosecha' ? '/productos' : '/insumos'" class="text-sm text-brand inline-flex items-center gap-1">
        <span class="material-icons-round text-lg">arrow_back</span>
        Volver
      </a>

      <div class="mt-3 rounded-3xl bg-green-50 grid place-items-center text-8xl py-10">{{ product.emoji }}</div>
      <h1 class="mt-4 text-2xl font-bold">{{ product.nombre }}</h1>
      <p class="text-earth text-sm">{{ product.vendedor }} · {{ product.ubicacion }}</p>
      <p class="mt-2 text-3xl font-bold text-brand">
        {{ product.precio | currency: 'USD' }}
        <span class="text-base font-normal text-stone-500">/ {{ product.unidad }}</span>
      </p>
      <p class="mt-3 text-stone-700">{{ product.descripcion }}</p>
      <p class="mt-2 text-sm text-stone-500">Disponible: {{ product.cantidad }} {{ product.unidad }}</p>

      <div class="mt-5 flex gap-2">
        <button (click)="ok.set(true)" class="flex-1 bg-accent text-stone-900 font-semibold py-3 rounded-xl flex justify-center items-center gap-1">
          <span class="material-icons-round">shopping_cart</span>
          Hacer pedido
        </button>
        <button class="flex-1 border border-brand text-brand font-semibold py-3 rounded-xl flex justify-center items-center gap-1">
          <span class="material-icons-round">call</span>
          Contactar
        </button>
      </div>

      @if (ok()) {
        <div class="mt-4 rounded-xl bg-green-100 text-green-900 p-3 text-sm flex items-center gap-2">
          <span class="material-icons-round">check_circle</span>
          Pedido enviado. El vendedor te contactará pronto.
        </div>
      }
    } @else if (loaded()) {
      <p class="text-center py-10">Producto no encontrado.</p>
    }
  `,
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getProductDetail = inject(GetProductDetailUseCase);

  readonly p = signal<Producto | null>(null);
  readonly loaded = signal(false);
  readonly ok = signal(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.p.set(id ? await this.getProductDetail.execute(id) : null);
    this.loaded.set(true);
  }
}
