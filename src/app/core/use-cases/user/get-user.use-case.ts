
import { Injectable } from '@angular/core';

import { UserRepository } from '../../domain/repositories/user.repository';

import { Usuarios } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GetUsersUseCase {

  constructor(
    private readonly repository: UserRepository
  ) { }

  execute(): Promise<Usuarios[]> {
    return this.repository.listar();
  }

}
