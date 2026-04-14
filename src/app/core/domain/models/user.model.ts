
/*Tipamos los roles limitando las opcions para mayor control */
export type Rol = 'admin' | 'agricultor' | 'consumidor';

export interface Usuarios {
    id?: string;
    nombre: string;
    departamento: string;
    direccion: string;
    correo: string;
    estadoPerfil: boolean;
    telefono: string;
    creadoEn?: Date | null;
    actualizadoEn?: Date | null;
    rol: Rol;
}