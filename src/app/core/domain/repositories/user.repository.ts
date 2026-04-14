import { Usuarios } from '../models/user.model';

export abstract class UserRepository {
  //Obtener todo los usuarios
  abstract listar(): Promise<Usuarios[]>;

  //Obtener un usuario por ID

  abstract obtenerPorId(
    id: string

  ): Promise<Usuarios | null>

  //actualizar
  abstract actualizar(
    id: string,
    datos: Partial<Usuarios>
  ): Promise<void>;

  //Eliminar
  abstract eliminar(
    id: string
  ): Promise<void>;


}
