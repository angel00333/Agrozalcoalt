
import { Injectable, signal } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


import { auth, db } from
    '../../core/infrastructure/repositories/firestore/firebase.config';
@Injectable({
    providedIn: 'root'
})
export class AuthSessionService {

    // Indica si Firebase encontró un usuario autenticado.
    readonly autenticado = signal(false);

    // Guarda el nombre que mostraremos en la barra superior.
    readonly nombre = signal<string | null>(null);

    readonly rol = signal<"admin" | "agricultor" | "consumidor" | null>(null);

    readonly cargandoRol = signal(true);

    constructor() {

        // Escucha automáticamente los cambios de autenticación.
        onAuthStateChanged(auth, async (usuario) => {

            this.rol.set(null);
            this.cargandoRol.set(true);

            // ==========================================
            // 1. USUARIO SIN SESIÓN
            // ==========================================
            if (!usuario) {
                this.autenticado.set(false);
                this.nombre.set(null);
                this.cargandoRol.set(false);

                console.log('Sin sesión activa');
                return;
            }

            // ==========================================
            // 2. USUARIO AUTENTICADO
            // ==========================================
            this.autenticado.set(true);

            //Nombre temporal mientras consultamos n Forestoringuies XD

            this.nombre.set(
                usuario.displayName || usuario.email

            );

            console.log('Usuario Autneticado:', usuario.uid);

            try {
                // ==========================================
                // 3. CONSULTAR PERFIL EN FIRESTORE
                // ==========================================


                // El UID corresponde al documento del usuario.
                const referencia = doc(
                    db,
                    'usuarios',
                    usuario.uid
                );


                //recuperamos la informacion del perfil ps
                const resultado = await getDoc(referencia);
                if (auth.currentUser?.uid !== usuario.uid) {

                    return;
                }
                if (resultado.exists()) {
                    const datos = resultado.data();

                    // Recuperamos el dato del agricultor o cconsumido
                    this.nombre.set(
                        datos['nombre'] || usuario.email
                    ); // ==========================================
                    // 4. IDENTIFICAR ROL
                    // ==========================================
                    const rolFirestore = datos['rol'];
                    if (
                        rolFirestore === 'agricultor' ||
                        rolFirestore === 'consumidor' ||
                        rolFirestore === 'admin'

                    ) {
                        this.rol.set(rolFirestore);
                    } else {
                        //Role desconochido o no register

                        this.rol.set(null);
                    }
                }

            } catch (error) {
                //Si falla Firestore, no concedemos ningun role XD

                if (auth.currentUser?.uid === usuario.uid) {
                    this.rol.set(null);
                } console.error(
                    'Erro al consultar perfil',
                    error
                );

            } finally {
                if (auth.currentUser?.uid === usuario.uid) {
                    this.cargandoRol.set(false);

                }
            }
        });





    }
    /**
     * OBTENER UID
     *
     * Espera a que Firebase determine el estado
     * inicial de autenticación y devuelve el UID.
     */
    async obtenerUid(): Promise<string | null> {

        await auth.authStateReady();

        return auth.currentUser?.uid ?? null;










    }
}