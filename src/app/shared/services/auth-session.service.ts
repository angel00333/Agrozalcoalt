
import { Injectable, signal } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

import { auth, db } from
    '../../core/infrastructure/repositories/firestore/firebase.config';
@Injectable({
    providedIn: 'root'
})
export class AuthSessionService {

    // Indica si Firebase encontró un usuario autenticado.
    readonly autenticado = signal(false);
    //Le indica a firebase  todavía esta comprobnando y se se guardo la sesionex
    readonly cargando = signal(true);

    // Guarda el nombre que mostraremos en la barra superior.
    readonly nombre = signal<string | null>(null);

    constructor() {

        // Escucha automáticamente los cambios de autenticación.
        onAuthStateChanged(auth, async (usuario) => {

            // Si no hay usuario, limpiamos el estado de sesión.
            if (!usuario) {
                this.autenticado.set(false);
                this.nombre.set(null);
                this.cargando.set(false);

                console.log('Sin sesion activa');
                return;
            }

            // Firebase Authentication encontró un usuario.
            this.autenticado.set(true);

            // Mostramos temporalmente su correo mientras carga el perfil.
            this.nombre.set(usuario.displayName || usuario.email);

            console.log('Usuario autenticado:', usuario.uid);

            try {
                // Buscamos el perfil utilizando el UID de Authentication.
                const referencia = doc(db, 'usuarios', usuario.uid);
                const resultado = await getDoc(referencia);

                // Si existe el documento, obtenemos su nombre.
                if (resultado.exists() && auth.currentUser?.uid === usuario.uid) {
                    this.nombre.set(
                        resultado.data()['nombre'] || usuario.email
                    );
                }

            } catch (error) {
                // Si falla Firestore, conservamos el correo como alternativa.
                console.error('Error al consultar perfil:', error);
            }

        });
    }

    // Devuelve el UID del usuario conectado.
    // Este método también lo utiliza ProfilePageComponent.
    async obtenerUid(): Promise<string | null> {
        await auth.authStateReady();
        return auth.currentUser?.uid ?? null;
    }
}