
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { AuthRepository } from './core/domain/repositories/auth.repository';
import { UserRepository } from './core/domain/repositories/user.repository';

import { FirebaseAuthRepository } from './core/infrastructure/repositories/firestore/firebase-auth.repository';
import { FirebaseUserRepository } from './core/infrastructure/repositories/fireb-user.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    {
      provide: AuthRepository,
      useClass: FirebaseAuthRepository
    },

    {
      provide: UserRepository,
      useClass: FirebaseUserRepository
    }
  ]
};
