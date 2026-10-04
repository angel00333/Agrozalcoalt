import { Injectable } from '@angular/core';
import { LoginCredentials, RegisterData } from '../../../../domain/models/auth.model';
import { AuthRepository } from '../../../../domain/repositories/auth.repository';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  async login(_credentials: LoginCredentials): Promise<void> {
    return;
  }

  async register(_data: RegisterData): Promise<void> {
    return;
  }

  async logout(): Promise<void> {
    return;
  }
}
