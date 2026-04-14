
import { UserRepository } from '../../domain/repositories/user.repository';

import { Usuarios } from '../../domain/models/user.model';

export class GetUserProfileUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(uid: string): Promise<Usuarios | null> {
        return this.repository.obtenerPorId(uid);
    }
}
