import { Injectable } from '@angular/core';

import {

    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp

} from 'firebase/firestore';

import { db } from './firestore/firebase.config';
import { Usuarios } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class FirebaseUserRepository extends UserRepository {
    async listar(): Promise<Usuarios[]> {
        const referencia = collection(db, 'usuarios');
        const resultado = await getDocs(referencia);
        return resultado.docs.map((documento) => {
            const datos = documento.data();
            return {
                id: documento.id,
                nombre: datos['nombre'],
                departamento: datos['departamento'],
                direccion: datos['direccion'],
                correo: datos['correo'],
                telefono: datos['telefono'],
                estadoPerfil: datos['estadoPerfil'],
                rol: datos['rol'],

                creadoEn:
                    datos['creadoEn'] instanceof Timestamp ?
                        datos['CreadoEn'].toDate()
                        : null,
                actualizadoEn:
                    datos['actualizadoEn'] instanceof Timestamp ?
                        datos['actualizadoEn'].toDate()
                        : null


            } as Usuarios;

        });

    }

    async obtenerPorId(id: string): Promise<Usuarios | null> {
        const referencia = doc(db, 'usuarios', id);
        const resultado = await getDoc(referencia);

        if (!resultado.exists()) {
            return null;
        }
        const datos = resultado.data();
        return {
            id: resultado.id,
            nombre: datos['nombre'],
            departamento: datos['departamento'],
            direccion: datos['direccion'],
            correo: datos['correo'],
            telefono: datos['telefono'],
            estadoPerfil: datos['estadoPerfil'],
            rol: datos['rol'],

            creadoEn:
                datos['creadoEn'] instanceof Timestamp ?
                    datos['CreadoEn'].toDate()
                    : null,
            actualizadoEn:
                datos['actualizadoEn'] instanceof Timestamp ?
                    datos['actualizadoEn'].toDate()
                    : null
        } as Usuarios;

    }


    async actualizar(
        id: string,
        datos: Partial<Usuarios>
    ): Promise<void> {
        const referencia = doc(db, 'usuarios', id);
        const cambios: Record<string, unknown> = {};
        if (datos.nombre != undefined)
            cambios['nombre'] = datos.nombre;
        if (datos.departamento != undefined)
            cambios['departamento'] != datos.departamento;
        if (datos.direccion != undefined)
            cambios['direccion'] != datos.direccion;
        if (datos.telefono != undefined)
            cambios['telefono'] != datos.telefono;
        if (datos.estadoPerfil != undefined)
            cambios['estadoPerfil'] = datos.estadoPerfil;
        if (Object.keys(cambios).length == 0) {
            return;
        }
        cambios['actualizadoEn'] = new Date();
        await updateDoc(referencia, cambios);


    }

    // Eliminar documento de Firestore
    async eliminar(id: string): Promise<void> {

        const referencia = doc(db, 'usuarios', id);

        await deleteDoc(referencia);
    }



}
