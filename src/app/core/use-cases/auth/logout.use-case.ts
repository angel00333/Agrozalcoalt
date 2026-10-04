import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute() {
    return this.repository.logout();
  }
}
