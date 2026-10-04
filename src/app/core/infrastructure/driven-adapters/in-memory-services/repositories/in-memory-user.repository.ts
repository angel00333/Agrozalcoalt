import { Injectable } from '@angular/core';
import { UserProfile } from '../../../../domain/models/user-profile.model';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { USER_PROFILE_ENTITY } from '../data/mock-data';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  async getProfile(): Promise<UserProfile> {
    return { ...USER_PROFILE_ENTITY };
  }
}
