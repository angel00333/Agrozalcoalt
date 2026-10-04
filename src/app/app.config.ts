import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AdvisoryRepository } from './core/domain/repositories/advisory.repository';
import { AuthRepository } from './core/domain/repositories/auth.repository';
import { OrderRepository } from './core/domain/repositories/order.repository';
import { ProductRepository } from './core/domain/repositories/product.repository';
import { UserRepository } from './core/domain/repositories/user.repository';
import { InMemoryAdvisoryRepository } from './core/infrastructure/driven-adapters/in-memory-services/repositories/in-memory-advisory.repository';
import { InMemoryAuthRepository } from './core/infrastructure/driven-adapters/in-memory-services/repositories/in-memory-auth.repository';
import { InMemoryOrderRepository } from './core/infrastructure/driven-adapters/in-memory-services/repositories/in-memory-order.repository';
import { InMemoryProductRepository } from './core/infrastructure/driven-adapters/in-memory-services/repositories/in-memory-product.repository';
import { InMemoryUserRepository } from './core/infrastructure/driven-adapters/in-memory-services/repositories/in-memory-user.repository';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: ProductRepository, useClass: InMemoryProductRepository },
    { provide: OrderRepository, useClass: InMemoryOrderRepository },
    { provide: AdvisoryRepository, useClass: InMemoryAdvisoryRepository },
    { provide: UserRepository, useClass: InMemoryUserRepository },
    { provide: AuthRepository, useClass: InMemoryAuthRepository },
  ],
};
