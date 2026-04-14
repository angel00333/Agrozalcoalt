
import { Injectable, inject } from '@angular/core';

import {
    ProductRepository,
    CambiosProductos
} from '../../domain/repositories/product.repository';

import { UserRepository } from '../../domain/repositories/user.repository';


@Injectable({
    providedIn: 'root'
})
export class UpdateProductUseCase {

    private readonly productos = inject(ProductRepository);
    private readonly usuarios = inject(UserRepository);

    // ==========================================
    // ACTUALIZAR UNA PUBLICACIÓN
    // ==========================================
    async execute(
        productoId: string,
        vendedorUID: string,
        cambios: CambiosProductos
    ): Promise<void> {

        // 1. Validar los identificadores.
        if (!productoId?.trim() || !vendedorUID?.trim()) {
            throw new Error('Debes iniciar sesión y seleccionar un producto.');
        }

        // 2. Comprobar que el usuario sea agricultor.
        const usuario = await this.usuarios.obtenerPorId(vendedorUID);

        if (!usuario || usuario.rol !== 'agricultor') {
            throw new Error(
                'Solo los agricultores pueden editar publicaciones.'
            );
        }

        // 3. Obtener la publicación original.
        const producto = await this.productos.obtenerProductoPorId(
            productoId
        );

        if (!producto) {
            throw new Error('La publicación no existe.');
        }

        // 4. Verificar que pertenezca al agricultor.
        if (producto.vendedorUID !== vendedorUID) {
            throw new Error(
                'No puedes editar publicaciones de otros agricultores.'
            );
        }

        // 5. Verificar que existan cambios.
        if (Object.keys(cambios).length === 0) {
            throw new Error('No hay cambios para guardar.');
        }

        // 6. Validar nombre y descripción.
        if (
            cambios.nombre !== undefined &&
            !cambios.nombre.trim()
        ) {
            throw new Error('El nombre del producto es obligatorio.');
        }

        if (
            cambios.descripcion !== undefined &&
            !cambios.descripcion.trim()
        ) {
            throw new Error('La descripción es obligatoria.');
        }

        // 7. Validar precio.
        if (
            cambios.precio !== undefined &&
            (
                !Number.isFinite(cambios.precio) ||
                cambios.precio <= 0
            )
        ) {
            throw new Error('El precio debe ser mayor que cero.');
        }

        // 8. Validar inventario.
        if (
            cambios.cantidadDisponible !== undefined &&
            (
                !Number.isInteger(cambios.cantidadDisponible) ||
                cambios.cantidadDisponible < 0
            )
        ) {
            throw new Error(
                'La cantidad debe ser un número entero igual o mayor que cero.'
            );
        }

        // 9. Validar ubicación y fotografía.
        if (
            cambios.ubicacion !== undefined &&
            !cambios.ubicacion.trim()
        ) {
            throw new Error('La ubicación es obligatoria.');
        }

        if (
            cambios.fotos !== undefined &&
            !cambios.fotos.trim()
        ) {
            throw new Error('Debes indicar una fotografía válida.');
        }

        // 10. Guardar los cambios.
        await this.productos.actualizarProducto(
            productoId,
            vendedorUID,
            cambios
        );

    }
}
