
import { Component, inject, signal } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
// Caso de uso encargado de cerrar la sesión.
import { LogoutUseCase } from '../../core/use-cases/auth/logout.use-case';




// Servicio que identifica al usuario autenticado.
import { AuthSessionService } from '../services/auth-session.service';
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 border-b border-white/10 bg-brand-dark text-white shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <a routerLink="/" class="flex min-w-0 items-center gap-2.5" aria-label="Ir al inicio de Agrozalcoalt">
          <span
            class="brand-logo-image h-10 w-10 shrink-0 sm:h-12 sm:w-12"
            role="img"
            aria-label="Logo Agrozalcoalt"
          ></span>
          <span class="brand-title truncate text-2xl leading-none sm:text-3xl">Agrozalcoalt</span>
        </a>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          @for (item of desktopItems; track item.link) {
            <a
              [routerLink]="item.link"
              routerLinkActive="bg-white/12 text-white"
              [routerLinkActiveOptions]="{ exact: item.link === '/' }"
              class="rounded-full px-4 py-2 text-sm font-medium text-green-50 hover:bg-white/10"
            >
              {{ item.label }}
            </a>
          }
        </nav>



@if (sesion.autenticado()) {

  <!-- CONTENEDOR: agrupa el nombre y el botón Salir -->
  <div class="flex items-center gap-2">

    <!-- PERFIL: muestra el nombre del usuario -->
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

    <!-- LOGOUT: cierra sesión al presionar el botón -->
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

  <!-- VISITANTE: conserva tu botón Comenzar -->
  <a
    routerLink="/login"
    class="inline-flex items-center gap-1.5 rounded-full
           bg-accent px-3 py-2 text-sm font-semibold
           text-stone-900 shadow-sm sm:px-4"
  >
    <span class="material-icons-round text-lg">login</span>
    <span class="hidden sm:inline">Comenzar</span>
  </a>

}
  </div>
</header>




  <!-- ==========================================
       CONTENIDO PRINCIPAL
       ========================================== -->

  <main class="mx-auto max-w-2xl p-4 pb-24">

    <!--
      RouterOutlet permite que Angular muestre
      la página correspondiente a la ruta actual:
      Inicio, Login, Registro o Perfil.
    -->
    <router-outlet />

  </main>


  <!-- ==========================================
       MENÚ INFERIOR PARA DISPOSITIVOS MÓVILES
       ========================================== -->

  <nav
    class="fixed bottom-0 inset-x-0 z-40 grid grid-cols-6
           border-t bg-white/95 text-[11px]
           backdrop-blur lg:hidden"
  >

    <!--
      Recorre el arreglo items de AppShellComponent
      y genera cada opción del menú móvil.
    -->
    @for (item of items; track item.link) {

      <a
        [routerLink]="item.link"
        routerLinkActive="text-brand font-semibold"
        [routerLinkActiveOptions]="{ exact: item.link === '/' }"
        class="flex flex-col items-center gap-0.5 py-2 text-stone-500"
      >

        <!-- Icono de la opción -->
        <span class="material-icons-round text-xl">
          {{ item.icon }}
        </span>

        <!-- Nombre de la opción -->
        {{ item.label }}

      </a>

    }


  `,
})

export class AppShellComponent {

  // =====================================
  // 1. SERVICIOS
  // =====================================

  // Obtiene el nombre y estado del usuario autenticado.
  readonly sesion = inject(AuthSessionService);

  // Ejecuta el cierre de sesión mediante Firebase.
  private readonly logout = inject(LogoutUseCase);

  // Permite navegar entre las páginas.
  private readonly router = inject(Router);

  // Evita que el botón Salir se presione varias veces.
  readonly cerrandoSesion = signal(false);


  // =====================================
  // 2. CERRAR SESIÓN
  // =====================================

  async cerrarSesion(): Promise<void> {

    // Evita solicitudes repetidas.
    if (this.cerrandoSesion()) return;

    // Deshabilita temporalmente el botón Salir.
    this.cerrandoSesion.set(true);

    try {

      // Cierra la sesión en Firebase Authentication.
      await this.logout.execute();

      // Regresa a la página principal.
      await this.router.navigateByUrl('/');

    } catch (error) {

      // Muestra un error técnico en la consola.
      console.error('Error al cerrar sesión:', error);

    } finally {

      // Habilita nuevamente el botón.
      this.cerrandoSesion.set(false);
    }
  }


  // =====================================
  // 3. MENÚ PRINCIPAL (ESCRITORIO)
  // =====================================

  // Opciones del menú superior.
  readonly desktopItems = [
    { link: '/', label: 'Inicio' },
    { link: '/productos', label: 'Catálogo' },
    { link: '/publicar', label: 'Publicar' },
    { link: '/asesoria', label: 'Asesoría' }
  ];


  // =====================================
  // 4. MENÚ INFERIOR (MÓVIL)
  // =====================================

  // Opciones de navegación en teléfonos.
  readonly items = [
    { link: '/', icon: 'home', label: 'Inicio' },
    { link: '/productos', icon: 'agriculture', label: 'Cosechas' },
    { link: '/insumos', icon: 'science', label: 'Insumos' },
    { link: '/asesoria', icon: 'forum', label: 'Asesoría' },
    { link: '/pedidos', icon: 'inventory_2', label: 'Pedidos' },
    { link: '/perfil', icon: 'person', label: 'Perfil' }
  ];

} // Cierre de AppShellComponent
