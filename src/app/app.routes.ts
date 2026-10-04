import { Routes } from '@angular/router';
import { AppShellComponent } from './features/shared/layout/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/pages/home.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'productos',
        data: { tipo: 'cosecha' },
        loadComponent: () => import('./features/catalog/pages/catalog.component').then((m) => m.CatalogPageComponent),
      },
      {
        path: 'insumos',
        data: { tipo: 'insumo' },
        loadComponent: () => import('./features/catalog/pages/catalog.component').then((m) => m.CatalogPageComponent),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./features/product-detail/pages/product-detail.component').then((m) => m.ProductDetailPageComponent),
      },
      {
        path: 'publicar',
        loadComponent: () => import('./features/publish/pages/publish.component').then((m) => m.PublishPageComponent),
      },
      {
        path: 'asesoria',
        loadComponent: () => import('./features/advisory/pages/advisory.component').then((m) => m.AdvisoryPageComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/orders/pages/orders.component').then((m) => m.OrdersPageComponent),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/profile/pages/profile.component').then((m) => m.ProfilePageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
