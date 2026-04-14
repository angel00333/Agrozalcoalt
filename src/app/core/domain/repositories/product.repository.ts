import { Producto } from "../models/producto.model";

export type CambiosProductos = Partial<Pick<
    Producto,
    | 'nombre'
    | 'descripcion'
    | 'categoria'
    | 'unidad'
    | 'precio'
    | 'cantidadDisponible'
    | 'ubicacion'
    | 'fotos'


>>;

export abstract class ProductRepository {

    /*
    1-Metod crear producto, recibe los datos y solicita,
    posteriormente guardarlo en la db y 
    retorno del ID del doc creado
    */
    abstract crearProducto(
        producto: Producto
    ): Promise<string>;

    /*
    2-Metos para obtener productos
    */

    abstract obtenerProductosPublicados(): Promise<Producto[]>;


    /*
    3-Metodo para editar productos
    */


    abstract obtenerProductoPorVendedor(
        vendedorUid: string
    ): Promise<Producto[]>;

    //Obtenemos el prod para cargar de su form de edicion.

    abstract obtenerProductoPorId(
        id: string
    ): Promise<Producto | null>;

    // Actualizar uuna d las publications existents XD
    abstract actualizarProducto(

        id: string,
        vendedorUID: string,
        cambios: CambiosProductos
    ): Promise<void>;


}





