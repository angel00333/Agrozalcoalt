
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
    Producto,
    UNIDADES_PRODUCTO
} from '../../../core/domain/models/producto.model';

import { ProductRepository } from '../../../core/domain/repositories/product.repository';
import { UpdateProductUseCase } from '../../../core/use-cases/products/update-product.use-case';
import { AuthSessionService } from '../../../shared/services/auth-session.service';

type FormularioProducto = {
    nombre: string;
    descripcion: string;
    categoria: Producto['categoria'];
    unidad: Producto['unidad'];
    precio: number;
    cantidadDisponible: number;
    ubicacion: string;
    fotos: string;
};

@Component({
    selector: 'app-editar-producto',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],

    template: `
    <section class="rounded-3xl bg-[#005d38] p-5 text-[#fff8e8]">

      <div class="rounded-3xl border border-[#568366] bg-[#194f35] p-5">

        <p class="text-xs font-bold uppercase tracking-wider text-[#b7e6a7]">
          Panel del agricultor
        </p>

        <h1 class="mt-2 text-3xl font-black">
          Editar producto
        </h1>

        <p class="mt-2 text-sm text-[#ccdccb]">
          Actualiza los datos de tu publicación.
        </p>

        <div *ngIf="cargando()" class="mt-6 text-center">
          Cargando información del producto...
        </div>

        <p
          *ngIf="mensajeError()"
          class="mt-4 rounded-xl bg-red-900/40 p-3 text-sm text-red-100"
        >
          {{ mensajeError() }}
        </p>

        <form
          *ngIf="!cargando() && producto()"
          #form="ngForm"
          (ngSubmit)="guardar(form)"
          class="mt-6 space-y-5"
        >

          <!-- Nombre -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              Nombre del producto
            </label>

            <input
              type="text"
              name="nombre"
              [(ngModel)]="formulario.nombre"
              required
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white outline-none"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              Descripción
            </label>

            <textarea
              name="descripcion"
              [(ngModel)]="formulario.descripcion"
              required
              rows="4"
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white outline-none"
            ></textarea>
          </div>

          <!-- Categoría -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              Categoría
            </label>

            <select
              name="categoria"
              [(ngModel)]="formulario.categoria"
              required
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
            >
              <option *ngFor="let categoria of categorias" [ngValue]="categoria">
                {{ categoria }}
              </option>
            </select>
          </div>

          <!-- Precio y unidad -->
          <div class="grid grid-cols-2 gap-3">

            <div>
              <label class="mb-2 block text-sm font-semibold">
                Precio ($)
              </label>

              <input
                type="number"
                name="precio"
                [(ngModel)]="formulario.precio"
                min="0.01"
                step="0.01"
                required
                class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold">
                Unidad
              </label>

              <select
                name="unidad"
                [(ngModel)]="formulario.unidad"
                required
                class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
              >
                <option *ngFor="let unidad of unidades" [ngValue]="unidad">
                  {{ unidad }}
                </option>
              </select>
            </div>

          </div>

          <!-- Existencias -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              Cantidad disponible
            </label>

            <input
              type="number"
              name="cantidadDisponible"
              [(ngModel)]="formulario.cantidadDisponible"
              min="0"
              step="1"
              required
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
            />
          </div>

          <!-- Ubicación -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              Ubicación del producto
            </label>

            <input
              type="text"
              name="ubicacion"
              [(ngModel)]="formulario.ubicacion"
              required
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
            />
          </div>

          <!-- Fotografía -->
          <div>
            <label class="mb-2 block text-sm font-semibold">
              URL de la fotografía
            </label>

            <input
              type="url"
              name="fotos"
              [(ngModel)]="formulario.fotos"
              required
              class="w-full rounded-xl border border-[#568366] bg-[#103a29] p-3 text-white"
            />

            <img
              *ngIf="formulario.fotos"
              [src]="formulario.fotos"
              alt="Vista previa del producto"
              class="mt-3 h-48 w-full rounded-xl object-cover"
            />
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap gap-3 pt-3">

            <button
              type="submit"
              [disabled]="guardando() || form.invalid"
              class="flex-1 rounded-xl bg-[#e9a91d] px-5 py-3 font-black text-[#173923] disabled:opacity-50"
            >
              {{ guardando() ? 'Guardando...' : 'Guardar cambios' }}
            </button>

            <a
              routerLink="/mis-publicaciones"
              class="rounded-xl border border-[#568366] px-5 py-3 text-center font-bold"
            >
              Cancelar
            </a>

          </div>

        </form>

      </div>

    </section>
  `
})
export class EditarProductoComponent implements OnInit {

    private readonly repositorio = inject(ProductRepository);
    private readonly actualizar = inject(UpdateProductUseCase);
    private readonly sesion = inject(AuthSessionService);
    private readonly ruta = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly producto = signal<Producto | null>(null);
    readonly cargando = signal(true);
    readonly guardando = signal(false);
    readonly mensajeError = signal('');

    readonly categorias = [
        'Frutas',
        'Hortalizas',
        'Granos básicos',
        'Tubérculos y raíces',
        'Hierbas y especias',
        'Semillas y plantas',
        'Insumos agrícolas',
        'Otros'
    ];

    readonly unidades = UNIDADES_PRODUCTO;

    formulario: FormularioProducto = {
        nombre: '',
        descripcion: '',
        categoria: '',
        unidad: UNIDADES_PRODUCTO[0],
        precio: 0,
        cantidadDisponible: 0,
        ubicacion: '',
        fotos: ''
    };

    ngOnInit(): void {
        void this.cargarProducto();
    }

    // ==========================================
    // CARGAR PUBLICACIÓN EXISTENTE
    // ==========================================
    async cargarProducto(): Promise<void> {

        this.cargando.set(true);
        this.mensajeError.set('');

        try {

            const id = this.ruta.snapshot.paramMap.get('id');
            const uid = await this.sesion.obtenerUid();

            if (!id || !uid) {
                throw new Error('No se pudo identificar la publicación.');
            }

            const encontrado = await this.repositorio.obtenerProductoPorId(id);

            if (!encontrado) {
                throw new Error('El producto no existe.');
            }

            if (encontrado.vendedorUID !== uid) {
                throw new Error('No puedes editar publicaciones de otros agricultores.');
            }

            this.producto.set(encontrado);

            this.formulario = {
                nombre: encontrado.nombre,
                descripcion: encontrado.descripcion,
                categoria: encontrado.categoria,
                unidad: encontrado.unidad,
                precio: encontrado.precio,
                cantidadDisponible: encontrado.cantidadDisponible,
                ubicacion: encontrado.ubicacion,
                fotos: encontrado.fotos
            };

        } catch (error) {

            this.mensajeError.set(
                error instanceof Error
                    ? error.message
                    : 'No fue posible cargar el producto.'
            );

        } finally {
            this.cargando.set(false);
        }
    }

    // ==========================================
    // GUARDAR CAMBIOS
    // ==========================================
    async guardar(form: NgForm): Promise<void> {

        if (form.invalid || this.guardando()) {
            return;
        }

        this.guardando.set(true);
        this.mensajeError.set('');

        try {

            const id = this.producto()?.id;
            const uid = await this.sesion.obtenerUid();

            if (!id || !uid) {
                throw new Error('No se pudo identificar al agricultor o al producto.');
            }

            await this.actualizar.execute(id, uid, {
                nombre: this.formulario.nombre.trim(),
                descripcion: this.formulario.descripcion.trim(),
                categoria: this.formulario.categoria,
                unidad: this.formulario.unidad,
                precio: Number(this.formulario.precio),
                cantidadDisponible: Number(this.formulario.cantidadDisponible),
                ubicacion: this.formulario.ubicacion.trim(),
                fotos: this.formulario.fotos.trim()
            });

            await this.router.navigateByUrl('/mis-publicaciones');

        } catch (error) {

            this.mensajeError.set(
                error instanceof Error
                    ? error.message
                    : 'No fue posible actualizar el producto.'
            );

        } finally {
            this.guardando.set(false);
        }
    }
}
