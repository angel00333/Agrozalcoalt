
import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {

  private readonly repository = inject(AuthRepository);

  execute(correo: string, password: string) {
    return this.repository.login(correo, password);
  }
}
