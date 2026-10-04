import { Injectable } from '@angular/core';
import { LoginCredentials } from '../../domain/models/auth.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(credentials: LoginCredentials) {
    return this.repository.login(credentials);
  }
}
