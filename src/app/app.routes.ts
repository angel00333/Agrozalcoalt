import { Routes } from '@angular/router';

import { AppShellComponent } from './shared/layout/app-shell.component';
import { HomePageComponent } from './features/home/pages/home.component';
import { LoginPageComponent } from './features/auth/pages/login.component';
import { RegisterPageComponent } from './features/auth/pages/register.component';
//Paginas para registrr pordcs del agricltr

import { PublicarProductoPageComponent } from '../app/features/products/pages/publicar-producto.component';

//Preoteccion del accedo por rolex XD
import { agricultorGuard } from '../app/shared/guards/agricultor.guard'


export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'registro',
        component: RegisterPageComponent
      },
      //Publicacion de prodcts: Solo os mazisox Agricltres
      {
        path: 'publicar',
        component: PublicarProductoPageComponent,
        canActivate: [agricultorGuard]
      }


    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];