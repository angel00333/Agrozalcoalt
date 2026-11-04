
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { UserRepository } from '../../../core/domain/repositories/user.repository';
import { Producto } from '../../../core/domain/models/producto.model';
import { GetProductsUseCase, } from '../../../core/use-cases/products/get-products.use-case';
import { AuthSessionService } from '../../../shared/services/auth-session.service';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [],

  template: `
    <section class="rounded-3xl bg-[#075235] p-4 text-[#fff8e8] sm:p-6">

      <!-- Encabezado -->
      <header class="mb-6">
        <p class="text-sm font-bold text-[#b7e6a7]">
          MERCADO AGRÍCOLA SALVADOREÑO
        </p>

        <h1 class="mt-2 text-3xl font-black sm:text-4xl">
          Catálogo de productos
        </h1>

        <p class="mt-2 text-base text-[#d2e5d5]">
          Encuentra productos frescos de nuestros agricultores.
        </p>
      </header>

      <!-- Buscador y categorías -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div>
          <label class="mb-2 block font-semibold">
            Buscar productos
          </label>

          <input
            #buscar
            type="search"
            placeholder="Tomate, yuca, Sonsonate..."
            [value]="busqueda()"
            (input)="busqueda.set(buscar.value)"
            class="min-h-12 w-full rounded-xl border border-[#568366] bg-white px-4 text-base text-[#173923] outline-none focus:ring-2 focus:ring-[#e9a91d]"
          />
        </div>

        <div>
          <label class="mb-2 block font-semibold">
            Categoría
          </label>

          <select
            #seleccion
            [value]="categoria()"
            (change)="categoria.set(seleccion.value)"
            class="min-h-12 w-full rounded-xl border border-[#568366] bg-white px-4 text-base text-[#173923]"
          >
            <option value="Todas">Todas las categorías</option>

            @for (item of categoriasDisponibles(); track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </div>

      </div>

      <!-- Contador -->
      <div class="my-5 flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-[#d2e5d5]" aria-live="polite">
          Productos encontrados: {{ productosFiltrados().length }}
        </p>

        <button
          type="button"
          (click)="limpiarFiltros()"
          class="min-h-11 rounded-xl border border-[#568366] px-4 text-sm font-bold"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Listado de productos -->
      @if (cargando() || sesion.cargandoRol()) {

        <p class="rounded-xl bg-[#103a29] p-8 text-center">
          Cargando productos...
        </p>

      } @else if (mensajeError()) {

        <p class="rounded-xl bg-red-900/40 p-5 text-red-100">
          {{ mensajeError() }}
        </p>

      } @else {

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          @for (producto of productosFiltrados(); track producto.id) {

            <article class="min-w-0 overflow-hidden rounded-2xl border border-[#568366] bg-[#103a29]">

              @if (producto.fotos) {
                <img
                  [src]="producto.fotos"
                  [alt]="producto.nombre"
                  loading="lazy"
                  class="h-52 w-full bg-white object-cover"
                />
              } @else {
                <div class="flex h-52 items-center justify-center bg-[#194f35] text-6xl">
                  🌱
                </div>
              }

              <div class="space-y-3 p-4">

                <div>
                  <h2 class="break-words text-xl font-bold">
                    {{ producto.nombre }}
                  </h2>

                  <p class="mt-1 text-sm text-[#b7d8bd]">
                    {{ producto.categoria }}
                  </p>
                                </div>

                <p class="text-2xl font-black text-[#f7c44d]">
                {{ '$' }}{{ producto.precio.toFixed(2) }}

                <span class="text-sm font-normal text-[#d2e5d5]">
                    / {{ producto.unidad }}
                </span>
                </p>
                            

                <p class="min-h-12 break-words text-sm text-[#d2e5d5]">
                  📍 {{ producto.ubicacion }}
                </p>

                <!-- Información y carrito visual -->
                <div class="grid grid-cols-[minmax(0,1fr)_56px] gap-2">

                  <button
                    type="button"
                    (click)="abrirDetalle(producto)"
                    class="flex min-h-12 items-center justify-center rounded-xl bg-[#e9a91d] px-4 py-3 font-bold text-[#173923]"
                    >
                    Ver información
                 </button>

                  <span
                    title="Carrito próximamente"
                    aria-label="Carrito próximamente"
                    class="flex min-h-12 items-center justify-center rounded-xl border border-[#568366] bg-[#194f35] text-2xl opacity-70"
                  >
                    🛒
                  </span>

                </div>

              </div>
            </article>

          } @empty {

            <div class="rounded-2xl bg-[#103a29] p-8 text-center sm:col-span-2 lg:col-span-3">
              <h2 class="text-xl font-bold">
                No encontramos productos
              </h2>

              <p class="mt-2 text-[#d2e5d5]">
                Prueba con otro nombre, categoría o ubicación.
              </p>
            </div>

          }

        </div>

      }



       
<!-- ==========================================
     MODAL DE INFORMACIÓN DEL PRODUCTO
========================================== -->

@if (productoSeleccionado(); as detalle) {

  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">

    <!-- Fondo oscuro -->
    <button
      type="button"
      aria-label="Cerrar información del producto"
      (click)="cerrarDetalle()"
      class="absolute inset-0 bg-black/75"
    ></button>

    <!-- Ventana emergente -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-detalle-producto"
      class="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#568366] bg-[#075235] shadow-2xl"
    >

      <!-- Encabezado -->
      <div class="flex items-center justify-between p-4">

        <h2 class="text-lg font-bold">
          Información del producto
        </h2>

        <button
          type="button"
          (click)="cerrarDetalle()"
          aria-label="Cerrar"
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103a29] text-2xl"
        >
          ×
        </button>

      </div>

      <!-- Fotografía -->
      @if (detalle.fotos) {

        <img
          [src]="detalle.fotos"
          [alt]="detalle.nombre"
          class="h-56 w-full bg-white object-contain sm:h-64"
        />

      }

      <!-- Información del producto -->
      <div class="space-y-4 p-5">

        <div>

          <p class="text-sm text-[#b7e6a7]">
            {{ detalle.categoria }}
          </p>

          <h3
            id="titulo-detalle-producto"
            class="mt-1 text-2xl font-black"
          >
            {{ detalle.nombre }}
          </h3>

          <p class="mt-2 text-3xl font-black text-[#f7c44d]">

            {{ '$' }}{{ detalle.precio.toFixed(2) }}

            <span class="text-sm font-normal text-white">
              / {{ detalle.unidad }}
            </span>

          </p>

        </div>

        <!-- Existencias y ubicación -->
        <div class="rounded-xl bg-[#103a29] p-4">

          <p class="text-sm text-[#b7e6a7]">
            Cantidad disponible
          </p>

          <p class="font-bold">
            {{ detalle.cantidadDisponible }}
            {{ detalle.unidad }}
          </p>

          <p class="mt-3 text-sm text-[#b7e6a7]">
            Ubicación
          </p>

          <p class="break-words font-bold">
            {{ detalle.ubicacion }}
          </p>

        </div>

        <!-- Descripción -->
        <div>

          <h4 class="font-bold">
            Descripción
          </h4>

          <p class="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-[#d2e5d5]">
            {{ detalle.descripcion }}
          </p>

        </div>

        <!-- ==========================================
             CONTACTO DEL AGRICULTOR
        ========================================== -->

        <div class="border-t border-[#568366] pt-4">

          <h4 class="mb-3 text-lg font-bold text-[#b7e6a7]">
            Contacto del agricultor
          </h4>

          @if(sesion.cargandoRol()){

            <p class="text-sm text-[#d2e5d5]">
              Verificando sesión...
            </p>
          } @else if (
        !sesion.autenticado() ||
        (
          sesion.rol() !== 'consumidor' &&
          sesion.rol() !== 'agricultor'
        )
          ) {

            <div class="rounded-xl bg-[#103a29] p-4 text-center">

              <p class="text-sm text-[#d2e5d5]">
                Inicia sesión para contactar al agricultor.
              </p>

            </div>

          } @else if (cargandoContacto()) {

            <p class="text-sm text-[#d2e5d5]">
              Consultando datos del agricultor...
            </p>

          } @else if (errorContacto()) {

            <p class="rounded-xl bg-red-900/40 p-3 text-sm text-red-100">
              {{ errorContacto() }}
            </p>

          } @else if (contactoVendedor(); as vendedor) {

            <!-- Nombre del agricultor -->
            <div class="mb-4 rounded-xl bg-[#103a29] p-4">

              <p class="text-sm text-[#b7e6a7]">
                Publicado por
              </p>

              <p class="mt-1 text-lg font-bold">
                👤 {{ vendedor.nombre }}
              </p>

            </div>

            <!-- WhatsApp -->
            @if (vendedor.telefono) {

              <a
                [href]="'https://wa.me/' + numeroWhatsApp(vendedor.telefono)"
                target="_blank"
                rel="noopener noreferrer"
                class="mb-3 flex min-h-12 items-center justify-center rounded-xl bg-[#e9a91d] px-4 py-3 text-center font-bold text-[#173923] hover:bg-[#f7c44d]"
              >
                💬 Contactar por WhatsApp
              </a>

            }

            <!-- Correo electrónico -->
            @if (vendedor.correo) {

              <a
                [href]="'mailto:' + vendedor.correo"
                class="flex min-h-12 items-center justify-center rounded-xl border border-[#8cba94] px-4 py-3 text-center font-bold text-white hover:bg-[#194f35]"
              >
                ✉ Enviar correo electrónico
              </a>

            }

            <!-- Sin contactos -->
            @if (!vendedor.telefono && !vendedor.correo) {

              <p class="rounded-xl bg-[#103a29] p-3 text-sm text-[#d2e5d5]">
                El agricultor no tiene contactos disponibles.
              </p>

            }

          } @else {

            <p class="text-sm text-[#d2e5d5]">
              Los datos de contacto no están disponibles.
            </p>

          }

        </div>

        <!-- Botón Cerrar -->
        <button
          type="button"
          (click)="cerrarDetalle()"
          class="min-h-12 w-full rounded-xl bg-[#e9a91d] px-4 py-3 font-bold text-[#173923]"
        >
          Cerrar
        </button>

      </div>

    </div>

  </div>

}


    </section>
  `,

  styles: [`
    :host {
      display: block;
      position: relative;
      left: 50%;
      width: min(1100px, calc(100vw - 32px));
      transform: translateX(-50%);
    }
  `]
})
export class CatalogoProductosComponent implements OnInit {

  private readonly consultar = inject(GetProductsUseCase);

  readonly sesion = inject(AuthSessionService);

  readonly productos = signal<Producto[]>([]);
  readonly uidActual = signal<string | null>(null);

  readonly busqueda = signal('');
  readonly categoria = signal('Todas');

  readonly cargando = signal(true);
  readonly mensajeError = signal('');


  // Publicaciones que puede ver el usuario.
  readonly productosVisibles = computed(() => {

    const esAgricultor = this.sesion.rol() === 'agricultor';
    const uid = this.uidActual();

    return this.productos().filter(producto => {

      if (producto.estado !== 'publicado') {
        return false;
      }

      if (
        producto.categoria === 'Insumos agrícolas' &&
        !esAgricultor
      ) {
        return false;
      }

      if (
        esAgricultor &&
        uid &&
        producto.vendedorUID === uid
      ) {
        return false;
      }

      return true;
    });
  });

  // Categorías disponibles para el usuario.
  readonly categoriasDisponibles = computed(() => {

    const categorias = this.productosVisibles()
      .map(producto => producto.categoria);

    return [...new Set(categorias)].sort();
  });

  // Filtrar por texto y categoría.
  readonly productosFiltrados = computed(() => {

    const texto = this.normalizar(this.busqueda());
    const seleccionada = this.categoria();

    return this.productosVisibles().filter(producto => {

      const coincideCategoria =
        seleccionada === 'Todas' ||
        producto.categoria === seleccionada;

      const contenido = this.normalizar([
        producto.nombre,
        producto.descripcion,
        producto.categoria,
        producto.ubicacion
      ].join(' '));

      return coincideCategoria && contenido.includes(texto);
    });
  });

  ngOnInit(): void {
    void this.cargarProductos();
  }

  // Consultar publicaciones de Firebase.
  async cargarProductos(): Promise<void> {

    this.cargando.set(true);
    this.mensajeError.set('');

    try {

      const [productos, uid] = await Promise.all([
        this.consultar.execute(),
        this.sesion.obtenerUid()
      ]);

      this.productos.set(productos);
      this.uidActual.set(uid);

    } catch (error) {

      this.mensajeError.set(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar los productos.'
      );

    } finally {
      this.cargando.set(false);
    }
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoria.set('Todas');
  }

  private normalizar(valor: string): string {

    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  numeroWhatsApp(numero: string): string {
    const digitos = numero.replace(/\D/g, '');

    return digitos.length === 8
      ? '503' + digitos
      : digitos;
  }

  readonly productoSeleccionado = signal<Producto | null>(null);



  private readonly usuarios = inject(UserRepository);

  readonly contactoVendedor = signal<{
    nombre: string;
    correo: string;
    telefono: string;
  } | null>(null);

  readonly cargandoContacto = signal(false);
  readonly errorContacto = signal('');


  async abrirDetalle(producto: Producto): Promise<void> {

    this.productoSeleccionado.set(producto);
    this.contactoVendedor.set(null);
    this.cargandoContacto.set(true);
    this.errorContacto.set('');

    try {

      const usuario = await this.usuarios.obtenerPorId(
        producto.vendedorUID
      );

      if (this.productoSeleccionado() !== producto) {
        return;
      }

      if (usuario?.rol !== 'agricultor') {
        throw new Error('No se encontró al agricultor.');
      }

      this.contactoVendedor.set({
        nombre: usuario.nombre ?? 'Agricultor',
        correo: usuario.correo ?? '',
        telefono: usuario.telefono ?? ''
      });

    } catch (error) {

      if (this.productoSeleccionado() === producto) {
        this.errorContacto.set(
          'No se pudo consultar el contacto del agricultor.'
        );
      }

    } finally {

      if (this.productoSeleccionado() === producto) {
        this.cargandoContacto.set(false);
      }


    }

  }

  // ==========================================
  // CERRAR MODAL DE INFORMACIÓN
  // ==========================================
  cerrarDetalle(): void {
    this.productoSeleccionado.set(null);
    this.contactoVendedor.set(null);
    this.cargandoContacto.set(false);
    this.errorContacto.set('');
  }


}
