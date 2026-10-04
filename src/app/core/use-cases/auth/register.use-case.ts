import { Injectable } from '@angular/core';
import { RegisterData } from '../../domain/models/auth.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(data: RegisterData) {
    return this.repository.register(data);
  }
}
