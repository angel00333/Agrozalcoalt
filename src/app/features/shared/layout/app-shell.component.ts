import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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

        <a
          routerLink="/login"
          class="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm sm:px-4"
        >
          <span class="material-icons-round text-lg">login</span>
          <span class="hidden sm:inline">Comenzar</span>
        </a>
      </div>
    </header>

    <main class="mx-auto max-w-2xl p-4 pb-24">
      <router-outlet />
    </main>

    <nav class="fixed bottom-0 inset-x-0 z-40 grid grid-cols-6 border-t bg-white/95 text-[11px] backdrop-blur lg:hidden">
      @for (item of items; track item.link) {
        <a
          [routerLink]="item.link"
          routerLinkActive="text-brand font-semibold"
          [routerLinkActiveOptions]="{ exact: item.link === '/' }"
          class="flex flex-col items-center gap-0.5 py-2 text-stone-500"
        >
          <span class="material-icons-round text-xl">{{ item.icon }}</span>
          {{ item.label }}
        </a>
      }
    </nav>
  `,
})
export class AppShellComponent {
  readonly desktopItems = [
    { link: '/', label: 'Inicio' },
    { link: '/productos', label: 'Catálogo' },
    { link: '/publicar', label: 'Publicar' },
    { link: '/asesoria', label: 'Asesoría' },
  ];

  readonly items = [
    { link: '/', icon: 'home', label: 'Inicio' },
    { link: '/productos', icon: 'agriculture', label: 'Cosechas' },
    { link: '/insumos', icon: 'science', label: 'Insumos' },
    { link: '/asesoria', icon: 'forum', label: 'Asesoría' },
    { link: '/pedidos', icon: 'inventory_2', label: 'Pedidos' },
    { link: '/perfil', icon: 'person', label: 'Perfil' },
  ];
}
