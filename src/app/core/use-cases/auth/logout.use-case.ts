
import { Injectable, inject } from '@angular/core';

import { AuthRepository } from
  '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {

  private readonly repository = inject(AuthRepository);

  execute(): Promise<void> {
    return this.repository.logout();
  }
}
