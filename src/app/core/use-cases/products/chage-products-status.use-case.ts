import { Injectable, inject } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({
    providedIn: 'root'
})
export class ChangeProductStatusUSeCase {

    private readonly productos = inject(ProductRepository);
    private readonly usuarios = inject(UserRepository);

    //===================================
    //Cambio de estado de una publicación
    //===================================
    async execute(
        productoId: string,
        vendedorUID: string,
        accion: 'desactivar' | 'reactivar'
    ): Promise<void> {

        if (!productoId?.trim() || !vendedorUID?.trim()) {

            throw new Error('Debes identificar al usuario y al producto.')
        }
        //1-Verification de que sea agrictr
        const usuario = await this.usuarios.obtenerPorId(vendedorUID);
        if (!usuario || usuario.rol !== 'agricultor') {
            throw new Error('Solo los agricultres pueden daministrar publicaciones');

        }
        //2.Consultar el producto.
        const producto = await this.productos.obtenerProductoPorId(
            productoId
        );
        if (!producto) {
            throw new Error('No se encontró la publicación.');

        }
        //3-Comprobar la propiedad.
        if (producto.vendedorUID != vendedorUID) {
            throw new Error('No puedes modificar la publicaciones de otros agricultores');
        }
        //4.Detemrinar el nuevo estado:

        if (accion === 'reactivar') {
            if (producto.estado !== 'inactivo') {
                throw new Error('El producto no está');
            }

            if (producto.cantidadDisponible <= 0) {
                throw new Error('Activar las existencia antes de reactivar');
            }
            await this.productos.cambiarEstadoProducto(
                productoId,
                vendedorUID,
                'publicado'
            );

        } else {
            if (producto.estado === 'inactivo') {
                throw new Error('El producto ya está desactivado');
            }
            await this.productos.cambiarEstadoProducto(
                productoId,
                vendedorUID,
                'inactivo'
            );
        }

    }


}













