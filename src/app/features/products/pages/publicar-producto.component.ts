import { Component, inject, signal } from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';

import { UNIDADES_PRODUCTO, UnidadProducto } from '../../../core/domain/models/producto.model';
import { AuthSessionService } from '../../../shared/services/auth-session.service';

import { createProductUseCase } from '../../../core/use-cases/products/create-product.use-case';

@Component({

    selector: 'app-publicar-producto',

    standalone: true,

    imports: [FormsModule],

    template: `

<!-- FONDO AGRÍCOLA Y TARJETA PRINCIPAL -->
    <section

      class="rounded-3xl bg-gradient-to-br from-[#08452a] via-[#0b6037] to-[#484b26] px-4 py-7 sm:px-6 sm:py-10"

    >

      <div

        class="mx-auto max-w-3xl rounded-[2rem] border border-[#568366] bg-[#194f35] p-5 text-[#f3f8ec] shadow-2xl shadow-black/25 sm:p-8"

      >

<!-- ENCABEZADO DEL FORMULARIO -->
        <div class="mb-8 flex items-start gap-4">

          <div

            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#266c45] text-[#b7e6a7]"

          >

            <span class="material-icons-round text-3xl">

              agriculture

            </span>

          </div>

          <div>

            <p class="text-sm font-bold uppercase tracking-[0.15em] text-[#b7e6a7]">

              Panel del agricultor

            </p>

            <h1 class="mt-2 text-3xl font-black leading-tight text-[#fff8e8] sm:text-4xl">

              Publicar nueva cosecha

            </h1>

            <p class="mt-3 text-sm leading-relaxed text-[#ccdccb]">

              Completa los datos de tu producto para ofrecerlo en Agrozalcoalt.

            </p>

          </div>

        </div>

<!-- FORMULARIO DE PUBLICACIÓN -->
        <form 

        #productoForm="ngForm" 

        (ngSubmit)="publicar(productoForm)" 

        class="space-y-6">

          <div>

            <label

              for="nombre"

              class="mb-2 block text-sm font-semibold text-[#edf5e8]"

            >

              Nombre del producto *

            </label>

            <input

              id="nombre"

              name="nombre"

              type="text"

              [(ngModel)]="formulario.nombre"

              required

              placeholder="Ej. Tomate fresco"

              class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

            />

          </div>

          <div>

            <label

              for="descripcion"

              class="mb-2 block text-sm font-semibold text-[#edf5e8]"

            >

              Descripción

            </label>

            <textarea

              id="descripcion"

              name="descripcion"

              [(ngModel)]="formulario.descripcion"

              rows="4"

              placeholder="Describe las características de tu cosecha..."

              class="w-full resize-y rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

            ></textarea>

          </div>

<!-- CLASIFICACIÓN DEL PRODUCTO -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

<!-- CATEGORÍA DEL PRODUCTO -->
        <div>

        <label

            for="categoria"

            class="mb-2 block text-sm font-semibold text-[#edf5e8]"

        >

            Categoría *

        </label>

        <select

            id="categoria"

            name="categoria"

            [(ngModel)]="formulario.categoria"

            required

            class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

        >

            <option value="" disabled>

            Selecciona una categoría

            </option>

            @for (categoria of categorias; track categoria) {

            <option

                [value]="categoria"

                class="bg-[#103a29] text-[#fff8e8]"

            >

                {{ categoria }}

            </option>

            }

        </select>

        </div>

            <div>

              <label

                for="unidad"

                class="mb-2 block text-sm font-semibold text-[#edf5e8]"

              >

                Unidad de venta *

              </label>

              <select

                id="unidad"

                name="unidad"

                [(ngModel)]="formulario.unidad"

                required

                class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

              >

                @for (unidad of unidades; track unidad) {

                  <option

                    [value]="unidad"

                    class="bg-[#103a29] text-[#fff8e8]"

                  >

                    {{ unidad }}

                  </option>

                }

              </select>

            </div>

          </div>

<!-- PRECIO E INVENTARIO -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>

              <label

                for="precio"

                class="mb-2 block text-sm font-semibold text-[#edf5e8]"

              >

                Precio de venta (USD) *

              </label>

              <input

                id="precio"

                name="precio"

                type="number"

                [(ngModel)]="formulario.precio"

                min="0.01"

                step="0.01"

                required

                placeholder="0.00"

                class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

              />

            </div>

            <div>

              <label

                for="cantidad"

                class="mb-2 block text-sm font-semibold text-[#edf5e8]"

              >

                Cantidad disponible *

              </label>

              <input

                id="cantidad"

                name="cantidad"

                type="number"

                [(ngModel)]="formulario.cantidadDisponible"

                min="0"

                step="1"

                required

                placeholder="Ej. 100"

                class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

              />

            </div>

          </div>

<!-- UBICACIÓN DEL PRODUCTO -->
          <div>

            <label

              for="ubicacion"

              class="mb-2 block text-sm font-semibold text-[#edf5e8]"

            >

              Ubicación del producto *

            </label>

            <div class="relative">

              <span

                class="material-icons-round absolute left-3 top-3 text-[#b7e6a7]"

              >

                location_on

              </span>

              <input

                id="ubicacion"

                name="ubicacion"

                type="text"

                [(ngModel)]="formulario.ubicacion"

                required

                placeholder="Ej. Sonsonate, El Salvador"

                class="w-full rounded-xl border border-[#568366] bg-[#103a29] py-3 pl-11 pr-4 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

              />

            </div>

          </div>

<!-- FOTOGRAFÍA DEL PRODUCTO -->
          <div>

            <label

              for="fotos"

              class="mb-2 block text-sm font-semibold text-[#edf5e8]"

            >

              Fotografía del producto

            </label>

            <div

              class="rounded-2xl border-2 border-dashed border-[#609d70] bg-[#245c3d] p-5"

            >

              <div class="mb-4 flex items-center gap-3">

                <div

                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#30744b] text-[#b7e6a7]"

                >

                  <span class="material-icons-round text-3xl">

                    add_photo_alternate

                  </span>

                </div>

                <div>

                  <p class="font-bold text-[#fff8e8]">

                    Imagen de la cosecha

                  </p>

                  <p class="mt-1 text-xs text-[#ccdccb]">

                    Por ahora puedes indicar la URL de una imagen.

                  </p>

                </div>

              </div>

              <input

                id="fotos"

                name="fotos"

                type="url"

                [(ngModel)]="formulario.fotos"

                placeholder="https://ejemplo.com/tomates.jpg"

                class="w-full rounded-xl border border-[#568366] bg-[#103a29] px-4 py-3 text-[#fff8e8] placeholder:text-[#b6cdbb] outline-none transition focus:border-[#e9a91d] focus:ring-2 focus:ring-[#e9a91d]/20"

              />

              @if (formulario.fotos.trim()) {

                <img

                  [src]="formulario.fotos"

                  alt="Vista previa del producto"

                  class="mt-4 h-48 w-full rounded-xl border border-[#609d70] object-cover"

                />

              }

            </div>

            <p class="mt-3 text-xs leading-relaxed text-[#ccdccb]">

              La carga de archivos desde el dispositivo se implementará con Firebase Storage.

            </p>

          </div>

<!-- GUARDADO DE PUBLICACIÓN -->
          <div class="border-t border-[#568366] pt-6">

            <button

              type="submit"
              [disabled]="guardando()"

              class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e9a91d] px-5 py-3.5 font-bold text-[#173923] shadow-lg shadow-black/10 transition hover:bg-[#f4bc39] disabled:cursor-not-allowed disabled:opacity-60"

            >

              <span class="material-icons-round">

                cloud_upload

              </span>

              {{ guardando() ? 'Guardando publicación...' : 'Publicar producto' }}

            </button>

            @if (mensajeExito()) {
              <p role="status" class="mt-3 rounded-xl border border-green-400/40 bg-green-900/40 p-3 text-center text-sm text-green-100">
                {{ mensajeExito() }}
              </p>
            }

            @if (mensajeError()) {
              <p role="alert" class="mt-3 rounded-xl border border-red-400/40 bg-red-950/40 p-3 text-center text-sm text-red-100">
                {{ mensajeError() }}
              </p>
            }

          </div>

        </form>

      </div>

    </section>

  `

})

export class PublicarProductoPageComponent {

    // Unidades permitidas por el modelo del dominio.
    readonly unidades = UNIDADES_PRODUCTO;

    // Datos temporales del formulario.
    formulario = {

        nombre: '',

        descripcion: '',

        categoria: '',

        unidad: UNIDADES_PRODUCTO[0],

        precio: null as number | null,

        cantidadDisponible: null as number | null,

        ubicacion: '',

        fotos: ''

    };

    // Categorías predefinidas para las publicaciones.
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

    // SERVICIOS Y ESTADO DE LA PUBLICACIÓN
    private readonly crearProducto = inject(createProductUseCase);
    private readonly sesion = inject(AuthSessionService);

    readonly guardando = signal(false);
    readonly mensajeExito = signal<string | null>(null);
    readonly mensajeError = signal<string | null>(null);

    // GUARDAR PRODUCTO EN FIRESTORE
    async publicar(productoForm: NgForm): Promise<void> {
        if (this.guardando()) return;

        // Si hay campos incorrectos, mostramos el motivo en lugar de bloquear el botón.
        if (productoForm.invalid) {
            productoForm.control.markAllAsTouched();
            this.mensajeExito.set(null);
            this.mensajeError.set('Completa los campos obligatorios, verifica que el precio sea mayor que cero y revisa la URL de la fotografía si la agregaste.');
            return;
        }

        this.mensajeExito.set(null);
        this.mensajeError.set(null);

        const precio = this.formulario.precio;
        const cantidad = this.formulario.cantidadDisponible;

        if (
            precio === null || !Number.isFinite(precio) || precio <= 0 ||
            cantidad === null || !Number.isFinite(cantidad) ||
            cantidad < 0 || !Number.isInteger(cantidad)
        ) {
            this.mensajeError.set('Revisa el precio y la cantidad disponible.');
            return;
        }

        if (!this.formulario.nombre.trim() || !this.formulario.ubicacion.trim()) {
            this.mensajeError.set('El nombre y la ubicación del producto son obligatorios.');
            return;
        }

        if (!this.categorias.includes(this.formulario.categoria)) {
            this.mensajeError.set('Selecciona una categoría válida.');
            return;
        }

        this.guardando.set(true);

        try {
            const vendedorUID = await this.sesion.obtenerUid();
            if (!vendedorUID) {
                throw new Error('Debes iniciar sesión para publicar.');
            }

            const idProducto = await this.crearProducto.execute({
                nombre: this.formulario.nombre,
                descripcion: this.formulario.descripcion,
                categoria: this.formulario.categoria,
                unidad: this.formulario.unidad as UnidadProducto,
                precio,
                cantidadDisponible: cantidad,
                ubicacion: this.formulario.ubicacion,
                fotos: this.formulario.fotos
            }, vendedorUID);

            this.mensajeExito.set('¡Producto publicado correctamente!');
            console.log('Producto guardado con ID:', idProducto);

            // Limpiamos el formulario después de guardar correctamente.
            this.formulario = {
                nombre: '',
                descripcion: '',
                categoria: '',
                unidad: UNIDADES_PRODUCTO[0],
                precio: null,
                cantidadDisponible: null,
                ubicacion: '',
                fotos: ''
            };


        } catch (error) {
            console.error('Error al publicar el producto:', error);
            this.mensajeError.set(
                error instanceof Error ? error.message : 'No se pudo guardar la publicación.'
            );
        } finally {
            this.guardando.set(false);
        }
    }

}