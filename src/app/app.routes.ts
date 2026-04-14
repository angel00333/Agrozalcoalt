import { Routes } from '@angular/router';
//Layout principal de Agrozalcoatl
import { AppShellComponent } from './shared/layout/app-shell.component';
//El inicioa permane e con carga inmediatax 
import { HomePageComponent } from './features/home/pages/home.component';

//Preoteccion del accedo por rolex XD
import { agricultorGuard } from '../app/shared/guards/agricultor.guard'


export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      // ==========================================
      // 1. INICIO - CARGA INMEDIATA
      // ==========================================
      {

        path: '',
        pathMatch: 'full',
        component: HomePageComponent
      },
      // ==========================================
      // 2. LOGIN - LAZY LOADING
      // ==========================================
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login.component')
            .then(m => m.LoginPageComponent)
      },
      // ==========================================
      // 3. REGISTRO - LAZY LOADING
      // ==========================================
      {
        path: 'registro',
        loadComponent: () =>
          import('./features/auth/pages/register.component')
            .then(m => m.RegisterPageComponent)
      },

      // ==========================================
      // 4. PUBLICAR PRODUCTO - LAZY LOADING
      // ==========================================

      {
        path: 'publicar',
        canActivate: [agricultorGuard],
        loadComponent: () =>
          import('../app/features/products/pages/publicar-producto.component')
            .then(m => m.PublicarProductoPageComponent)
      },
      {
        path: 'mis-publicaciones',
        canActivate: [agricultorGuard],
        loadComponent: () =>
          import('./features/products/pages/mis-publicaciones.component')
            .then(m => m.MisPublicacionesPageComponent)
      },
      {
        path: 'editar-producto/:id',
        canActivate: [agricultorGuard],
        loadComponent: () =>
          import('./features/products/pages/editar-producto.component')
            .then(m => m.EditarProductoComponent)
      }



    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];