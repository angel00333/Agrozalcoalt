
export interface Producto {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidadDisponible: number;
    categoria: string;
    estado: string;
    fotos: string;
    ubicacion: string;
    unidad: string;
    creadosEn?: Date | null;

    // Propiedades opcionales para la interfaz actual
    emoji?: string;
    vendedor?: string;
}
