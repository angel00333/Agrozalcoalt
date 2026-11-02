import { inject } from '@angular/core';
import { CanActivateFn, Router } from "@angular/router";
import { getDoc, doc } from 'firebase/firestore';

import { auth, db } from '../../core/infrastructure/repositories/firestore/firebase.config';

export const agricultorGuard: CanActivateFn = async () => {
    const router = inject(Router);

    //Fireabse determine si hay sesión.

    await auth.authStateReady();
    const usuario = auth.currentUser;

    //sin sesion, redigi a login.

    if (!usuario) {
        return router.createUrlTree(['/login']);
    }
    try {
        //consultamos el rol real del user y Firebs
        const referencia = doc(
            db, 'usuarios',
            usuario.uid
        );
        const resultado = await getDoc(referencia);
        if (
            resultado.exists() && resultado.data()['rol'] === 'agricultor'
        ) {
            return true;
        }
        //Cualquier otro rol regresa al inicio ojo 

        return router.createUrlTree(['/']);



    } catch (error) {
        console.error(
            'No se pudo verificar el dol com agricultor',
            error
        );
        return router.createUrlTree(['/']);
    }



};










