import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuevoProducto, TipoProducto } from '../../../core/domain/models/producto.model';
import { GetProductCategoriesUseCase } from '../../../core/use-cases/products/get-product-categories.use-case';
import { PublishProductUseCase } from '../../../core/use-cases/products/publish-product.use-case';

@Component({
  selector: 'app-publish',
  imports: [FormsModule],
  template: `
    <h1 class="text-xl font-bold">Publicar producto</h1>

    <div class="mt-4 space-y-3">
      <input [(ngModel)]="form.nombre" placeholder="Nombre del producto" class="w-full rounded-xl border border-stone-300 p-3 bg-white" />

      <select [(ngModel)]="form.tipo" class="w-full rounded-xl border border-stone-300 p-3 bg-white">
        <option value="cosecha">Cosecha</option>
        <option value="insumo">Insumo</option>
      </select>

      <select [(ngModel)]="form.categoria" class="w-full rounded-xl border border-stone-300 p-3 bg-white">
        @for (c of categorias(); track c) {
          <option [value]="c">{{ c }}</option>
        }
      </select>

      <div class="grid grid-cols-2 gap-3">
        <input [(ngModel)]="form.precio" type="number" placeholder="Precio (USD)" class="rounded-xl border border-stone-300 p-3 bg-white" />
        <input [(ngModel)]="form.cantidad" type="number" placeholder="Cantidad" class="rounded-xl border border-stone-300 p-3 bg-white" />
      </div>

      <input [(ngModel)]="form.unidad" placeholder="Unidad (lb, quintal...)" class="w-full rounded-xl border border-stone-300 p-3 bg-white" />
      <input [(ngModel)]="form.ubicacion" placeholder="Ubicación" class="w-full rounded-xl border border-stone-300 p-3 bg-white" />
      <textarea [(ngModel)]="form.descripcion" rows="3" placeholder="Descripción" class="w-full rounded-xl border border-stone-300 p-3 bg-white"></textarea>

      <div class="rounded-xl border-2 border-dashed border-stone-300 p-6 text-center text-stone-500">
        <span class="material-icons-round text-4xl block">add_a_photo</span>
        Subir foto
      </div>

      <button (click)="publicar()" class="w-full bg-brand text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
        <span class="material-icons-round">publish</span>
        Publicar
      </button>

      @if (ok()) {
        <div class="rounded-xl bg-green-100 text-green-900 p-3 text-sm flex items-center gap-2">
          <span class="material-icons-round">check_circle</span>
          Producto publicado correctamente.
        </div>
      }
    </div>
  `,
})
export class PublishPageComponent implements OnInit {
  private readonly getCategories = inject(GetProductCategoriesUseCase);
  private readonly publishProduct = inject(PublishProductUseCase);

  readonly categorias = signal<string[]>([]);
  readonly ok = signal(false);

  form: NuevoProducto = {
    nombre: '',
    tipo: 'cosecha' as TipoProducto,
    categoria: 'Hortalizas',
    precio: 0,
    unidad: '',
    cantidad: 0,
    ubicacion: '',
    vendedor: 'Mario Pérez',
    emoji: '🌱',
    descripcion: '',
  };

  async ngOnInit() {
    const categories = await this.getCategories.execute();
    this.categorias.set(categories.filter((item) => item !== 'Todas'));
  }

  async publicar() {
    await this.publishProduct.execute({ ...this.form });
    this.ok.set(true);
  }
}
