
import { Injectable } from '@angular/core';

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    Timestamp,
    DocumentSnapshot,
    DocumentData,
    runTransaction
} from 'firebase/firestore';

import { db, auth } from './firebase.config';

import { Producto } from '../../../domain/models/producto.model';
import { ProductRepository, CambiosProductos } from '../../../domain/repositories/product.repository';


@Injectable()
export class FirebaseProductRepository extends ProductRepository {

    // ==========================================
    // 1. GUARDAR UNA PUBLICACIÓN
    // ==========================================
    async crearProducto(producto: Producto): Promise<string> {

        const referencia = collection(db, 'productos');

        const documento = await addDoc(referencia, {
            ...producto,
            creadosEn: serverTimestamp(),
            actualizadoEn: serverTimestamp()
        });

        return documento.id;
    }


    // ==========================================
    // 2. CONSULTAR PRODUCTOS PUBLICADOS
    // ==========================================
    async obtenerProductosPublicados(): Promise<Producto[]> {

        const consulta = query(
            collection(db, 'productos'),
            where('estado', '==', 'publicado')
        );

        const resultado = await getDocs(consulta);

        return resultado.docs.map(documento =>
            this.convertirProducto(documento)
        );
    }


    // ==========================================
    // 3. CONSULTAR PRODUCTOS DEL AGRICULTOR
    // ==========================================
    async obtenerProductoPorVendedor(
        vendedorUID: string
    ): Promise<Producto[]> {

        const consulta = query(
            collection(db, 'productos'),
            where('vendedorUID', '==', vendedorUID)
        );

        const resultado = await getDocs(consulta);

        return resultado.docs.map(documento =>
            this.convertirProducto(documento)
        );
    }
    // ==========================================
    // 4. CONSULTAR PRODUCTO POR ID
    // ==========================================

    override async obtenerProductoPorId(id: string): Promise<Producto | null> {
        const referencia = doc(db, 'productos', id);
        const resultado = await getDoc(referencia);
        if (!resultado.exists()) {
            return null;
        }
        return this.convertirProducto(resultado);

    }

    // ==========================================
    // 5. ACTUALIZAR PRODUCTO
    // ==========================================

    async actualizarProducto(
        id: string,
        vendedorUID: string,
        cambios: CambiosProductos
    ): Promise<void> {

        // Comprobar que el UID pertenezca a la sesión.
        if (auth.currentUser?.uid !== vendedorUID) {
            throw new Error(
                'No tienes permiso para modificar este producto.'
            );
        }

        const referencia = doc(db, 'productos', id);

        await runTransaction(db, async (transaccion) => {

            const resultado = await transaccion.get(referencia);

            if (!resultado.exists()) {
                throw new Error('El producto no existe.');
            }

            const datos = resultado.data();

            // Verificar que el agricultor sea el propietario.
            if (datos['vendedorUID'] !== vendedorUID) {
                throw new Error(
                    'Este producto pertenece a otro agricultor.'
                );
            }

            // Conservar existencias anteriores si no se modifican.
            const cantidad =
                cambios.cantidadDisponible ??
                datos['cantidadDisponible'];

            // Actualizar el estado según las existencias.
            const estado =
                datos['estado'] === 'inactivo'
                    ? 'inactivo'
                    : cantidad === 0
                        ? 'agotado'
                        : 'publicado';

            // Evitar campos undefined en Firestore.
            const cambiosValidos = Object.fromEntries(
                Object.entries(cambios).filter(
                    ([, valor]) => valor !== undefined
                )
            );

            transaccion.update(referencia, {
                ...cambiosValidos,
                estado,
                actualizadoEn: serverTimestamp()
            });

        });

    }


    // ==========================================
    // 6. CONVERTIR DATOS DE FIRESTORE AL MODELO
    // ==========================================
    private convertirProducto(
        documento: DocumentSnapshot<DocumentData>
    ): Producto {

        const datos = documento.data();
        //Verificcamos el documento que contenda la la info
        if (!datos) {
            throw new Error(
                'No se encontraron los datos del producto'
            );
        }

        return {
            ...datos,
            id: documento.id,
            creadosEn:
                datos['creadosEn'] instanceof Timestamp
                    ? datos['creadosEn'].toDate()
                    : undefined,
            actualizadoEn:
                datos['actualizadoEn'] instanceof Timestamp
                    ? datos['actualizadoEn'].toDate()
                    : undefined
        } as Producto;
    }

}















