import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../core/domain/models/producto.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="landing-page">
      <section class="hero-section overflow-hidden text-white">
        <div class="hero-grid mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-20">
          <div class="relative z-10">
            <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-green-50 backdrop-blur">
              <span class="material-icons-round text-lg text-amber-300">eco</span>
              Mercado agrícola salvadoreño
            </div>

            <div class="flex items-center gap-4">
              <span
                class="brand-logo-image hidden h-28 w-28 drop-shadow-lg sm:block lg:h-36 lg:w-36"
                role="img"
                aria-label="Logo Agrozalcoalt"
              ></span>
              <div>
                <h1 class="brand-title text-5xl leading-none tracking-wide sm:text-6xl lg:text-7xl">Agrozalcoalt</h1>
                <p class="mt-3 max-w-2xl text-lg leading-relaxed text-green-50 sm:text-xl">
                  Conectamos productores, agricultores y compradores para fortalecer el comercio directo del campo.
                </p>
              </div>
            </div>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                routerLink="/productos"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-stone-900 shadow-lg shadow-black/10"
              >
                <span class="material-icons-round">agriculture</span>
                Explorar productos
                <span class="material-icons-round text-lg">arrow_forward</span>
              </a>
              <a
                routerLink="/publicar"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                <span class="material-icons-round">upload</span>
                Publicar cosecha
              </a>
            </div>

            <div class="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-green-50 sm:grid-cols-3">
              <div class="flex items-center gap-2"><span class="material-icons-round text-amber-300">grass</span> Más oportunidades</div>
              <div class="flex items-center gap-2"><span class="material-icons-round text-amber-300">groups</span> Comercio directo</div>
              <div class="flex items-center gap-2"><span class="material-icons-round text-amber-300">handshake</span> Comunidad agrícola</div>
            </div>
          </div>

          <div class="relative hidden min-h-[420px] lg:block">
            <div class="absolute inset-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-sm"></div>
            <span
              class="brand-logo-image absolute right-0 top-1/2 h-[380px] w-[380px] -translate-y-1/2 opacity-20"
              role="img"
              aria-label="Símbolo de Agrozalcoalt"
            ></span>
            <div class="absolute bottom-4 left-5 right-5 grid grid-cols-2 gap-3">
              @for (p of destacados().slice(0, 4); track p.id) {
                <a [routerLink]="['/detalle', p.id]" class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md hover:bg-white/15">  
                <!-- Fotografía del producto -->
                <div class="h-40 overflow-hidden bg-green-50">

                  <img
                    [src]="p.fotos || '/images/productos/sin-imagen.webp'"
                    [alt]="'Fotografía de ' + p.nombre"
                    loading="lazy"
                    class="h-full w-full object-cover"
                  />

                </div>

                  <p class="mt-3 font-semibold">{{ p.nombre }}</p>
                  <p class="text-xs text-green-100">{{ p.ubicacion }}</p>
                </a>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="bg-cream px-5 py-12 sm:px-8 lg:px-10">
        <div class="mx-auto max-w-7xl">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            @for (feature of features; track feature.title) {
              <a [routerLink]="feature.link" class="group rounded-3xl border border-stone-200/80 bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div class="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-brand">
                  <span class="material-icons-round">{{ feature.icon }}</span>
                </div>
                <h2 class="mt-4 text-lg font-bold text-brand-dark">{{ feature.title }}</h2>
                <p class="mt-2 text-sm leading-relaxed text-stone-600">{{ feature.description }}</p>
                <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  Ver más <span class="material-icons-round text-lg">arrow_forward</span>
                </span>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="bg-[#fbfaf6] px-5 py-14 sm:px-8 lg:px-10">
        <div class="mx-auto max-w-7xl">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-brand">Productos destacados</p>
              <h2 class="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Del campo a tu mesa</h2>
              <p class="mt-2 max-w-2xl text-stone-600">Explora productos frescos publicados por agricultores y proveedores de la comunidad.</p>
            </div>
            <a routerLink="/productos" class="inline-flex items-center justify-center gap-2 rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand">
              Ver catálogo completo
              <span class="material-icons-round text-lg">arrow_forward</span>
            </a>
          </div>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
           
        @for (p of destacados(); track p.id) {

          <!-- Tarjeta del producto destacado -->
          <a
            [routerLink]="['/detalle', p.id]"
            class="overflow-hidden rounded-3xl border border-stone-200
                  bg-white shadow-sm transition hover:-translate-y-1
                  hover:shadow-lg"
          >

            <!-- FOTOGRAFÍA DEL PRODUCTO -->
            <div class="h-40 overflow-hidden bg-green-50">

              <img
                [src]="p.fotos || '/images/productos/sin-imagen.webp'"
                [alt]="'Fotografía de ' + p.nombre"
                loading="lazy"
                class="h-full w-full object-cover"
              />

            </div>

            <!-- INFORMACIÓN DEL PRODUCTO -->
            <div class="p-4">

              <div class="flex items-start justify-between gap-2">

                <div class="min-w-0">

                  <!-- Nombre del producto -->
                  <h3 class="truncate font-bold text-stone-900">
                    {{ p.nombre }}
                  </h3>

                  <!-- Nombre del agricultor: pendiente de consultar -->
                  <p class="mt-1 truncate text-xs text-stone-500">
                    Agricultor
                  </p>

                </div>

                <!-- Icono para acceder al detalle -->
                <span class="material-icons-round text-stone-300">
                  arrow_outward
                </span>

              </div>

              <!-- PRECIO Y UNIDAD -->
              <div class="mt-4 flex items-center justify-between gap-2">

                <p class="font-bold text-brand">
                  {{ p.precio | currency:'USD' }}
                </p>

                <span class="rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">
                  / {{ p.unidad }}
                </span>

              </div>

            </div>

          </a>

        }

          </div>
        </div>
      </section>

      <section class="bg-[#fbfaf6] px-5 pb-14 sm:px-8 lg:px-10">
        <div class="community-banner mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-7 text-white sm:p-10">
          <div class="relative z-10 max-w-2xl">
            <span class="material-icons-round text-4xl text-amber-300">landscape</span>
            <h2 class="mt-3 text-3xl font-black sm:text-4xl">Impulsando un mejor campo, juntos.</h2>
            <p class="mt-3 leading-relaxed text-green-50">
              Agrozalcoalt acerca productores y compradores, facilita la publicación de cosechas y crea un punto de encuentro para asesoría y comercio agrícola.
            </p>
            <a routerLink="/login" class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-brand-dark">
              Formar parte de la comunidad
              <span class="material-icons-round text-lg">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      <footer class="bg-brand-dark px-5 py-8 text-green-50 sm:px-8 lg:px-10">
        <div class="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span
              class="brand-logo-image h-12 w-12"
              role="img"
              aria-label="Logo Agrozalcoalt"
            ></span>
            <div>
              <p class="brand-title text-2xl">Agrozalcoalt</p>
              <p class="text-xs text-green-200">Por un campo más fuerte.</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a routerLink="/productos" class="hover:text-white">Catálogo</a>
            <a routerLink="/publicar" class="hover:text-white">Publicar</a>
            <a routerLink="/asesoria" class="hover:text-white">Asesoría</a>
            <a routerLink="/login" class="hover:text-white">Ingresar</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      left: 50%;
      width: 100vw;
      margin-left: -50vw;
      margin-top: -1rem;
      margin-bottom: -6rem;
    }

    .hero-section {
      position: relative;
      background:
        radial-gradient(circle at 75% 20%, rgba(232, 161, 44, 0.22), transparent 28%),
        radial-gradient(circle at 15% 80%, rgba(100, 157, 77, 0.24), transparent 30%),
        linear-gradient(135deg, #0f3520 0%, #174d2b 52%, #214f2f 100%);
    }

    .hero-section::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.22;
      background-image:
        linear-gradient(30deg, rgba(255,255,255,.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.05) 87.5%, rgba(255,255,255,.05)),
        linear-gradient(150deg, rgba(255,255,255,.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.05) 87.5%, rgba(255,255,255,.05));
      background-size: 80px 140px;
    }

    .hero-grid {
      position: relative;
      z-index: 1;
    }

    .community-banner {
      position: relative;
      background:
        radial-gradient(circle at 90% 15%, rgba(232,161,44,.30), transparent 30%),
        linear-gradient(115deg, #123b24 0%, #1a5b31 55%, #123b24 100%);
    }

    .community-banner::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      right: -70px;
      bottom: -110px;
      border-radius: 50%;
      border: 50px solid rgba(255,255,255,.04);
    }
  `],
})
export class HomePageComponent {

  readonly destacados = signal<Producto[]>([]);

  readonly features = [
    {
      icon: 'storefront',
      title: 'Catálogo agrícola',
      description: 'Descubre cosechas e insumos disponibles y conecta directamente con quienes los ofrecen.',
      link: '/productos',
    },
    {
      icon: 'forum',
      title: 'Asesoría especializada',
      description: 'Consulta dudas de cultivo y comercialización dentro de un espacio orientado al sector agrícola.',
      link: '/asesoria',
    },
    {
      icon: 'location_on',
      title: 'Geolocalización',
      description: 'Identifica productos y oportunidades según la ubicación de productores y compradores.',
      link: '/productos',
    },
    {
      icon: 'inventory_2',
      title: 'Publica tus productos',
      description: 'Registra cosechas o insumos con precio, disponibilidad, ubicación y descripción.',
      link: '/publicar',
    },
  ];


}
