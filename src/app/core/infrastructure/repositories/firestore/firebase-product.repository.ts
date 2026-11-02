
import { Injectable } from '@angular/core';

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    serverTimestamp,
    Timestamp,
    QueryDocumentSnapshot,
    DocumentData
} from 'firebase/firestore';

import { db } from './firebase.config';

import { Producto } from '../../../domain/models/producto.model';
import { ProductRepository } from '../../../domain/repositories/product.repository';

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
    // 4. CONVERTIR DATOS DE FIRESTORE AL MODELO
    // ==========================================
    private convertirProducto(
        documento: QueryDocumentSnapshot<DocumentData>
    ): Producto {

        const datos = documento.data();

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















