import { Routes } from '@angular/router';

import { AppShellComponent } from './shared/layout/app-shell.component';
import { HomePageComponent } from './features/home/pages/home.component';
import { LoginPageComponent } from './features/auth/pages/login.component';
import { RegisterPageComponent } from './features/auth/pages/register.component';

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
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];