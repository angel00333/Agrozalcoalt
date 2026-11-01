import { Producto } from "../models/producto.model";

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



}





