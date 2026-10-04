import { Injectable } from '@angular/core';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class GetUserProfileUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute() {
    return this.repository.getProfile();
  }
}
