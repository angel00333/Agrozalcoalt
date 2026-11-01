import { inject, Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository'
import { UserRepository } from '../../domain/repositories/user.repository';


import {
    Producto,
    UNIDADES_PRODUCTO

} from '../../domain/models/producto.model';


/*
Cargamos datos pora crear un producto
-Tomamos el modelo único de klos campos
que el agric pued ecompletar.

El ID, las fech y std y UID se gestionaran por sep OJAZO

*/

export type DatosNuevoProducto = Pick<
    Producto,
    | 'nombre'
    | 'descripcion'
    | 'precio'
    | 'cantidadDisponible'
    | 'categoria'
    | 'unidad'
    | 'ubicacion'
    | 'fotos'
>;

@Injectable({
    providedIn: 'root'
})
export class createProductUseCase {
    private readonly usuarioRepositorio = inject(UserRepository);

    private readonly repositorio = inject(ProductRepository);

    async execute(
        datos: DatosNuevoProducto,
        vendedorUid: string

    ): Promise<string> {

        // ==========================================
        // VALIDAR QUE EL USUARIO SEA AGRICULTOR
        // ==========================================

        // Consultamos el perfil del usuario mediante su UID.
        const usuario = await this.usuarioRepositorio.obtenerPorId(
            vendedorUid.trim()
        );

        // Verificamos que el usuario exista.
        if (!usuario) {
            throw new Error(
                'No se encontró el perfil del usuario.'
            );
        }

        // Solo el agricultor tiene permiso para publicar.
        if (usuario.rol !== 'agricultor') {
            throw new Error(
                'Solo los agricultores pueden publicar productos.'
            );
        }

        // Si es agricultor, continuamos con las
        // validaciones del nombre, precio y existencias.


        //1-Verificamos que exista una gricultos identificadetion XD
        if (!vendedorUid?.trim()) {
            throw new Error('Debes inciar seseión para publicar');

        }
        //2-Validamos nombnre

        if (!datos.nombre?.trim()) {
            throw new Error('El nombre del producto es Obligatorio!');
        }

        //3-Validamos Precio
        if (!Number.isFinite(datos.precio) || datos.precio <= 0) {

            throw new Error('El precio del producto debe ser mayor a cero');
        }

        //4-Validamos cantidad Disponible
        // Validamos que la cantidad sea numérica y no negativa.
        // Permitimos cero porque representa un producto agotado.
        if (
            !Number.isFinite(datos.cantidadDisponible) ||
            datos.cantidadDisponible < 0

        ) {
            throw new Error('La cantidad disponible no puede ser negativa');
        }

        //5. Validad informacion bäsica.
        if (
            !datos.categoria?.trim() ||
            !datos.unidad?.trim()
        ) {
            throw new Error(
                'Debes indicar la categoría y la unidad.'
            );
        }

        //6-Validamos unidad que seya permitida XD

        if (!UNIDADES_PRODUCTO.some(
            unidad => unidad === datos.unidad
        )) {
            throw new Error('La unidad de comercialización no es válida.');

        }

        //7-Valida ubicacion

        if (!datos.ubicacion?.trim()) {
            throw new Error(
                'Debes indicar la ubicación del producto.'
            );
        }


        //8-Construimos el objetox XD
        const producto: Producto = {
            ...datos,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            categoria: datos.categoria.trim(),
            unidad: datos.unidad.trim(),
            ubicacion: datos.ubicacion.trim(),
            fotos: datos.fotos?.trim() ?? '',
            // Estado automático según las existencias Ojazo con eto
            estado: datos.cantidadDisponible === 0
                ? 'agotado'
                : 'publicado',
            vendedorUID: vendedorUid.trim(),


        };
        //9-Solicitamos al repositorio que guarde la merca' XD
        return await this.repositorio.crearProducto(producto);


    }



}
















