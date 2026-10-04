import { LoginCredentials, RegisterData } from '../models/auth.model';

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Promise<void>;
  abstract register(data: RegisterData): Promise<void>;
  abstract logout(): Promise<void>;
}
