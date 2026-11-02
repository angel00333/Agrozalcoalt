
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// ==========================================
// 1. REPOSITORIOS DEL DOMINIO
// ==========================================

import { AuthRepository } from './core/domain/repositories/auth.repository';

import { UserRepository } from './core/domain/repositories/user.repository';

import { ProductRepository } from './core/domain/repositories/product.repository';


// ==========================================
// 2. IMPLEMENTACIONES DE FIREBASE
// ==========================================

import { FirebaseAuthRepository } from './core/infrastructure/repositories/firestore/firebase-auth.repository';

import { FirebaseUserRepository } from './core/infrastructure/repositories/fireb-user.repository';

import { FirebaseProductRepository } from './core/infrastructure/repositories/firestore/firebase-product.repository';


// ==========================================
// 3. CONFIGURACIÓN DE ANGULAR
// ==========================================

export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    // Autenticación de usuarios.
    {
      provide: AuthRepository,
      useClass: FirebaseAuthRepository
    },

    // Información del perfil de usuarios.
    {
      provide: UserRepository,
      useClass: FirebaseUserRepository
    },

    // Publicación y consulta de productos.
    {
      provide: ProductRepository,
      useClass: FirebaseProductRepository
    }

  ]

};
