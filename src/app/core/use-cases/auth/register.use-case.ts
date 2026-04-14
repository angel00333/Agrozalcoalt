
import { Injectable, inject } from '@angular/core';

import {
  AuthRepository,
  DatosRegistro
} from '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class RegisterUseCase {

  private readonly repository = inject(AuthRepository);

  execute(datos: DatosRegistro, password: string) {
    return this.repository.registrar(datos, password);
  }
}
