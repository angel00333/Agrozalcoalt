
import { Injectable } from '@angular/core';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

import { auth, db } from './firebase.config';

import {
  AuthRepository,
  DatosRegistro
} from '../../../domain/repositories/auth.repository';

import { Usuarios } from '../../../domain/models/user.model';

@Injectable()
export class FirebaseAuthRepository extends AuthRepository {

  // 1. Obtener los datos del usuario desde Firestore
  private async cargarPerfil(uid: string): Promise<Usuarios> {

    const referencia = doc(db, 'usuarios', uid);
    const resultado = await getDoc(referencia);

    if (!resultado.exists()) {
      throw new Error('No existe el perfil del usuario.');
    }

    const datos = resultado.data();

    return {
      id: resultado.id,
      nombre: datos['nombre'],
      correo: datos['correo'],
      telefono: datos['telefono'],
      departamento: datos['departamento'],
      direccion: datos['direccion'],
      rol: datos['rol'],
      estadoPerfil: datos['estadoPerfil'],
      creadoEn: datos['creadoEn'] instanceof Timestamp
        ? datos['creadoEn'].toDate()
        : null,
      actualizadoEn: datos['actualizadoEn'] instanceof Timestamp
        ? datos['actualizadoEn'].toDate()
        : null
    };
  }

  // 2. Iniciar sesión
  async login(
    correo: string,
    password: string
  ): Promise<Usuarios> {

    const credenciales = await signInWithEmailAndPassword(
      auth,
      correo,
      password
    );

    return this.cargarPerfil(credenciales.user.uid);
  }

  // 3. Registrar usuario
  async registrar(
    datos: DatosRegistro,
    password: string
  ): Promise<Usuarios> {

    const credenciales = await createUserWithEmailAndPassword(
      auth,
      datos.correo,
      password
    );

    await setDoc(
      doc(db, 'usuarios', credenciales.user.uid),
      {
        ...datos,
        estadoPerfil: true,
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp()
      }
    );

    return this.cargarPerfil(credenciales.user.uid);
  }

  // 4. Cerrar sesión
  async logout(): Promise<void> {
    await signOut(auth);
  }

  // 5. Obtener sesión actual
  async obtenerUsuarioActual(): Promise<Usuarios | null> {

    await auth.authStateReady();

    const usuario = auth.currentUser;

    if (!usuario) {
      return null;
    }

    return this.cargarPerfil(usuario.uid);
  }
}
