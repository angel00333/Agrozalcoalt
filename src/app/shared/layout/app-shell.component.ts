
import { Component, inject, signal } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { LogoutUseCase } from '../../core/use-cases/auth/logout.use-case';
import { AuthSessionService } from '../services/auth-session.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],

  template: `

    <!-- ==========================================
         1. ENCABEZADO PRINCIPAL
         ========================================== -->
    <header class="sticky top-0 z-40 border-b border-white/10 bg-brand-dark text-white shadow-sm">

      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">

        <a
          routerLink="/"
          class="flex min-w-0 items-center gap-2.5"
          aria-label="Ir al inicio de Agrozalcoalt"
        >
          <span
            class="brand-logo-image h-10 w-10 shrink-0 sm:h-12 sm:w-12"
            role="img"
            aria-label="Logo Agrozalcoalt"
          ></span>

          <span class="brand-title truncate text-2xl leading-none sm:text-3xl">
            Agrozalcoalt
          </span>
        </a>


        <!-- ==========================================
             2. NAVEGACIÓN DE ESCRITORIO
             ========================================== -->
        <nav
          class="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >

          @for (item of desktopItems; track item.link) {

            @if (
              item.link !== '/publicar' ||
              (
                !sesion.cargandoRol() &&
                sesion.autenticado() &&
                sesion.rol() === 'agricultor'
              )
            ) {

              <a
                [routerLink]="item.link"
                routerLinkActive="bg-white/12 text-white"
                [routerLinkActiveOptions]="{ exact: item.link === '/' }"
                class="rounded-full px-4 py-2 text-sm font-medium text-green-50 hover:bg-white/10"
              >
                {{ item.label }}
              </a>

            }

          }

        </nav>


        <!-- ==========================================
             3. USUARIO AUTENTICADO O VISITANTE
             ========================================== -->
        @if (sesion.autenticado()) {

          <div class="flex items-center gap-2">

            <a
              routerLink="/perfil"
              class="inline-flex items-center gap-2 rounded-full
                     bg-white/10 px-3 py-2 text-sm font-semibold
                     text-white hover:bg-white/20"
            >

              <span class="material-icons-round text-lg">
                account_circle
              </span>

              <span class="hidden sm:inline">
                Hola, {{ sesion.nombre() || 'Usuario' }}
              </span>

            </a>


            <button
              type="button"
              (click)="cerrarSesion()"
              [disabled]="cerrandoSesion()"
              class="inline-flex items-center gap-2 rounded-full
                     bg-accent px-3 py-2 text-sm font-semibold
                     text-stone-900 hover:opacity-90
                     disabled:opacity-50"
            >

              <span class="material-icons-round text-lg">
                logout
              </span>

              <span>
                {{ cerrandoSesion() ? 'Saliendo...' : 'Salir' }}
              </span>

            </button>

          </div>

        } @else {

          <a
            routerLink="/login"
            class="inline-flex items-center gap-1.5 rounded-full
                   bg-accent px-3 py-2 text-sm font-semibold
                   text-stone-900 shadow-sm sm:px-4"
          >

            <span class="material-icons-round text-lg">
              login
            </span>

            <span class="hidden sm:inline">
              Comenzar
            </span>

          </a>

        }

      </div>

    </header>


    <!-- ==========================================
         4. CONTENIDO PRINCIPAL DEL LAYOUT
         ========================================== -->
    <main class="mx-auto max-w-2xl p-4 pb-24">

      <router-outlet />

    </main>


    <!-- ==========================================
         5. MENÚ INFERIOR PARA MÓVILES
         ========================================== -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 grid grid-cols-6
             border-t bg-white/95 text-[11px]
             backdrop-blur lg:hidden"
      aria-label="Navegación móvil"
    >

      @for (item of items; track item.link) {

        <a
          [routerLink]="item.link"
          routerLinkActive="text-brand font-semibold"
          [routerLinkActiveOptions]="{ exact: item.link === '/' }"
          class="flex flex-col items-center gap-0.5 py-2 text-stone-500"
        >

          <span class="material-icons-round text-xl">
            {{ item.icon }}
          </span>

          {{ item.label }}

        </a>

      }


      <!-- Agricultor: acceso a publicar desde móvil -->
      @if (
        !sesion.cargandoRol() &&
        sesion.autenticado() &&
        sesion.rol() === 'agricultor'
      ) {

        <a
          routerLink="/publicar"
          routerLinkActive="text-brand font-semibold"
          class="flex flex-col items-center gap-0.5 py-2 text-stone-500"
        >

          <span class="material-icons-round text-xl">
            add_circle
          </span>

          Publicar

        </a>

      } @else if (!sesion.cargandoRol()) {

        <a
          routerLink="/pedidos"
          routerLinkActive="text-brand font-semibold"
          class="flex flex-col items-center gap-0.5 py-2 text-stone-500"
        >

          <span class="material-icons-round text-xl">
            inventory_2
          </span>

          Pedidos

        </a>

      }

    </nav>

  `,
})

export class AppShellComponent {

  // ==========================================
  // 1. SERVICIOS Y ESTADO DE SESIÓN
  // ==========================================

  readonly sesion = inject(AuthSessionService);

  private readonly logout = inject(LogoutUseCase);

  private readonly router = inject(Router);

  readonly cerrandoSesion = signal(false);


  // ==========================================
  // 2. CERRAR SESIÓN
  // ==========================================

  async cerrarSesion(): Promise<void> {

    if (this.cerrandoSesion()) return;

    this.cerrandoSesion.set(true);

    try {

      await this.logout.execute();

      await this.router.navigateByUrl('/');

    } catch (error) {

      console.error('Error al cerrar sesión:', error);

    } finally {

      this.cerrandoSesion.set(false);

    }

  }


  // ==========================================
  // 3. MENÚ PRINCIPAL DE ESCRITORIO
  // ==========================================

  readonly desktopItems = [
    { link: '/', label: 'Inicio' },
    { link: '/productos', label: 'Catálogo' },
    { link: '/publicar', label: 'Publicar' },
    { link: '/asesoria', label: 'Asesoría' }
  ];


  // ==========================================
  // 4. MENÚ INFERIOR DE MÓVILES
  // ==========================================

  // Cinco opciones fijas.
  // La sexta cambia según el rol del usuario.
  readonly items = [
    { link: '/', icon: 'home', label: 'Inicio' },
    { link: '/productos', icon: 'agriculture', label: 'Cosechas' },
    { link: '/insumos', icon: 'science', label: 'Insumos' },
    { link: '/asesoria', icon: 'forum', label: 'Asesoría' },
    { link: '/perfil', icon: 'person', label: 'Perfil' }
  ];

}
