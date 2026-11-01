
// ============================================
// UNIDADES DE COMERCIALIZACIÓN
// ============================================

export const UNIDADES_PRODUCTO = [
    'libra',
    'quintal',
    'kilogramo',
    'docena',
    'unidad',
    'galon',
    'litro',
    'tahullab',
    'arroba',
    'manojo',
    'saco',
]

// TypeScript obtiene los valores válidos
// directamente del arreglo anterior.

export type UnidadProducto =
    typeof UNIDADES_PRODUCTO[number];


// ============================================
// ESTADOS DEL PRODUCTO ... de una aquí ta
// ============================================
export type EstadoProducto =
    | 'publicado'
    | 'agotado'
    | 'inactivo';

// ============================================
// COORDENADAS GEOGRÁFICAS
// ============================================

export interface CoordenadasProducto {

    // Latitud geográfica.
    lat: number;

    // Longitud geográfica.
    lng: number;
}


//Extructura que se debe cumplir según la coleccion
export interface Producto {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidadDisponible: number;
    categoria: string;
    estado: EstadoProducto;
    fotos: string;
    ubicacion: string;
    coordenadas?: CoordenadasProducto;
    unidad: UnidadProducto;
    creadosEn?: Date | null;
    actualizadoEn?: Date | null;

    // Propiedades opcionales para la interfaz actual
    vendedorUID: string;
}
