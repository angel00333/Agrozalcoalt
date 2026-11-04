import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { ChangeProductStatusUSeCase } from '../../../core/use-cases/products/chage-products-status.use-case';

import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Producto } from '../../../core/domain/models/producto.model';

import { AuthSessionService } from '../../../shared/services/auth-session.service';

import { GetSellerProductUseCase } from '../../../core/use-cases/products/get-seller-products.use-case';

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],

  template: `

    <!-- PANEL DEL AGRICULTOR -->
    <section
      class="rounded-3xl bg-gradient-to-br from-[#08452a] via-[#0b6037] to-[#484b26] p-4 sm:p-6"
    >

      <div class="rounded-[2rem] border border-[#568366] bg-[#194f35] p-5 text-[#f3f8ec] shadow-xl sm:p-7">

        <!-- ENCABEZADO -->
        <div class="flex flex-wrap items-start justify-between gap-4">

          <div>
            <p class="text-sm font-bold uppercase tracking-wider text-[#b7e6a7]">
              Panel del agricultor
            </p>

            <h1 class="mt-2 text-3xl font-black text-[#fff8e8]">
              Mis publicaciones
            </h1>

            <p class="mt-2 text-sm text-[#ccdccb]">
              Consulta los productos que has registrado en Agrozalcoalt.
            </p>
          </div>

          <a
            routerLink="/publicar"
            class="inline-flex items-center gap-2 rounded-xl bg-[#e9a91d] px-4 py-3 text-sm font-bold text-[#173923] hover:bg-[#f4bc39]"
          >
            <span class="material-icons-round text-lg">
              add_circle
            </span>
            Nueva cosecha
          </a>

        </div>

        <!-- RESUMEN DEL INVENTARIO -->
        <div class="mt-7 grid grid-cols-3 gap-3">
<!-- Total de publicaciones registradas -->
          <div class="rounded-2xl bg-[#103a29] p-3 text-center">
            <p class="text-2xl font-black text-white">
              {{ productos().length }}
            </p>
            <p class="text-xs text-[#ccdccb]">Publicaciones Totales</p>
          </div>
<!-- Productos con estado publicado/ ojo(No unidae)-->
          <div class="rounded-2xl bg-[#103a29] p-3 text-center">
            <p class="text-2xl font-black text-[#b7e6a7]">
              {{ publicados() }}
            </p>
            <p class="text-xs text-[#ccdccb]">Productos disponibles</p>
          </div>
<!-- Productos con estado publicado -->
          <div class="rounded-2xl bg-[#103a29] p-3 text-center">
            <p class="text-2xl font-black text-[#f7c44d]">
              {{ agotados() }}
            </p>
            <p class="text-xs text-[#ccdccb]">Agotados</p>
          </div>

        </div>

        <!-- CARGA Y MENSAJES -->
        <div class="mt-7">

          @if (cargando()) {

            <div class="rounded-2xl bg-[#103a29] p-8 text-center">
              <span class="material-icons-round animate-pulse text-4xl text-[#b7e6a7]">
                hourglass_top
              </span>
              <p class="mt-3 text-sm">
                Cargando publicaciones...
              </p>
            </div>

          } @else if (mensajeError()) {

            <div
              role="alert"
              class="rounded-xl border border-red-400 bg-red-950/40 p-4"
            >
              <p class="text-sm text-red-100">
                {{ mensajeError() }}
              </p>

              <button
                type="button"
                (click)="cargarProductos()"
                class="mt-3 rounded-xl bg-[#e9a91d] px-4 py-2 font-semibold text-[#173923]"
              >
                Reintentar
              </button>
            </div>

          } @else if (productos().length === 0) {

            <div class="rounded-2xl bg-[#103a29] p-8 text-center">

              <span class="material-icons-round text-5xl text-[#b7e6a7]">
                inventory_2
              </span>

              <h2 class="mt-3 text-xl font-bold">
                No tienes publicaciones todavía
              </h2>

              <p class="mt-2 text-sm text-[#ccdccb]">
                Registra tu primera cosecha para verla aquí.
              </p>

            </div>

          } @else {

            <!-- PRODUCTOS RECUPERADOS DE FIRESTORE -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

              @for (producto of productos(); track producto.id ?? $index) {

                <article
                  class="overflow-hidden rounded-2xl border border-[#568366] bg-[#103a29]"
                >

                  @if (producto.fotos) {

                    <img
                      [src]="producto.fotos"
                      [alt]="'Fotografía de ' + producto.nombre"
                      loading="lazy"
                      class="h-44 w-full object-cover"
                    />

                  } @else {

                    <div class="flex h-44 items-center justify-center bg-[#245c3d]">
                      <span class="material-icons-round text-6xl text-[#b7e6a7]">
                        agriculture
                      </span>
                    </div>

                  }

                  <div class="p-4">

                    <h2 class="break-words text-lg font-bold text-[#fff8e8]">
                      {{ producto.nombre }}
                    </h2>

                    <p class="mt-1 text-xs text-[#ccdccb]">
                      {{ producto.categoria }}
                    </p>

                    <div class="mt-4 flex items-center justify-between gap-2">

                      <span class="text-xl font-black text-[#f7c44d]">
                        {{ producto.precio | currency:'USD' }}
                      </span>

                      <span class="text-xs text-[#ccdccb]">
                        / {{ producto.unidad }}
                      </span>

                    </div>

                    <div class="mt-4 space-y-2 border-t border-[#568366] pt-4 text-sm">

                      <div class="flex justify-between gap-3">
                        <span class="text-[#ccdccb]">Cantidad</span>
                        <span class="font-semibold">
                          {{ producto.cantidadDisponible }}
                        </span>
                      </div>

                      <div class="flex justify-between gap-3">
                        <span class="text-[#ccdccb]">Ubicación</span>
                        <span class="text-right">
                          {{ producto.ubicacion }}
                        </span>
                      </div>

                    </div>

                    <!-- ESTADO ACTUAL -->
                    <div class="mt-4">

                      @if (producto.estado === 'publicado') {

                        <span class="rounded-full bg-green-800 px-3 py-1 text-xs font-bold text-green-100">
                          Publicado
                        </span>

                      } @else if (producto.estado === 'agotado') {

                        <span class="rounded-full bg-amber-700 px-3 py-1 text-xs font-bold text-white">
                          Agotado
                        </span>

                      } @else {

                        <span class="rounded-full bg-stone-600 px-3 py-1 text-xs font-bold text-white">
                          Inactivo
                        </span>

                      }


                    
                  <!-- Acciones disponibles para el propietario -->
                  @if (producto.id) {

                    <div class="mt-4 grid grid-cols-2 gap-2">

                      <!-- Editar publicación -->
                      <a
                        [routerLink]="['/editar-producto', producto.id]"
                        class="flex items-center justify-center rounded-xl bg-[#e9a91d] px-3 py-2.5 text-center text-xs font-bold text-[#173923]"
                      >
                        ✎ Editar
                      </a>

                      <!-- Desactivar / Reactivar -->
                      <button
                        type="button"
                        (click)="alternarEstado(producto)"
                        [disabled]="
                          productoEnProceso() !== null ||
                          (
                            producto.estado === 'inactivo' &&
                            producto.cantidadDisponible <= 0
                          )
                        "
                        class="rounded-xl bg-[#e5f2e6] px-3 py-2.5 text-xs font-bold text-[#173923] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        @if (productoEnProceso() === producto.id) {
                          Guardando...
                        } @else if (producto.estado === 'inactivo') {
                          Reactivar
                        } @else {
                          Desactivar
                        }
                      </button>

                    </div>

                    @if (
                      producto.estado === 'inactivo' &&
                      producto.cantidadDisponible <= 0
                    ) {
                      <p class="mt-2 text-xs text-[#f7c44d]">
                        Registra existencias antes de reactivar.
                      </p>
                    }
                  }



                    </div>

                  </div>

                </article>

              }

            </div>

          }

        </div>

      </div>
    </section>

  `
})
export class MisPublicacionesPageComponent implements OnInit {

  // Servicios de sesión y consulta.
  private readonly sesion = inject(AuthSessionService);
  private readonly consultar = inject(GetSellerProductUseCase);
  private readonly cambiarEstado = inject(ChangeProductStatusUSeCase);

  // Estado de la pantalla.
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly mensajeError = signal<string | null>(null);
  readonly productoEnProceso = signal<string | null>(null);

  // Estadísticas automáticas.
  readonly publicados = computed(() =>
    this.productos().filter(p => p.estado === 'publicado').length
  );

  readonly agotados = computed(() =>
    this.productos().filter(p => p.estado === 'agotado').length
  );


  ngOnInit(): void {
    void this.cargarProductos();
  }



  // Consultar las publicaciones del usuario autenticado.
  async cargarProductos(): Promise<void> {

    this.cargando.set(true);
    this.mensajeError.set(null);

    try {

      const uid = await this.sesion.obtenerUid();

      if (!uid) {
        throw new Error('Debes iniciar sesión.');
      }

      const resultado = await this.consultar.execute(uid);

      this.productos.set(resultado);

    } catch (error) {

      console.error('Error al cargar productos:', error);

      this.mensajeError.set(
        error instanceof Error
          ? error.message
          : 'No se pudieron consultar los productos.'
      );

    } finally {

      this.cargando.set(false);

    }


  }


  // ==========================================
  // DESACTIVAR O REACTIVAR PRODUCTO
  // ==========================================
  async alternarEstado(producto: Producto): Promise<void> {

    if (!producto.id || this.productoEnProceso()) {
      return;
    }

    const accion =
      producto.estado === 'inactivo'
        ? 'reactivar'
        : 'desactivar';

    this.productoEnProceso.set(producto.id);
    this.mensajeError.set('');

    try {

      const uid = await this.sesion.obtenerUid();

      if (!uid) {
        throw new Error('Debes iniciar sesión.');
      }

      await this.cambiarEstado.execute(
        producto.id,
        uid,
        accion
      );

      // Recargar los productos y los indicadores.
      await this.cargarProductos();

    } catch (error) {

      this.mensajeError.set(
        error instanceof Error
          ? error.message
          : 'No fue posible cambiar el estado.'
      );

    } finally {

      this.productoEnProceso.set(null);

    }
  }


}