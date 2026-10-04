import { UserProfile } from '../models/user-profile.model';

export abstract class UserRepository {
  abstract getProfile(): Promise<UserProfile>;
}
