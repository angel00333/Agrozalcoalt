
import { Usuarios } from '../models/user.model';

export type DatosRegistro = Omit<
  Usuarios,
  | 'id'
  | 'estadoPerfil'
  | 'rol'
  | 'creadoEn'
  | 'actualizadoEn'
> & {
  rol: 'agricultor' | 'consumidor';
};

export abstract class AuthRepository {

  abstract login(
    correo: string,
    password: string
  ): Promise<Usuarios>;

  abstract registrar(
    datos: DatosRegistro,
    password: string
  ): Promise<Usuarios>;

  abstract logout(): Promise<void>;

  abstract obtenerUsuarioActual():
    Promise<Usuarios | null>;

}
