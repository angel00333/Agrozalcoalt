
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegisterUseCase } from '../../../core/use-cases/auth/register.use-case';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterLink],

    template: `
    <div class="min-h-screen bg-brand grid place-items-center p-4">

      <div class="w-full max-w-md bg-[#111111]
                  rounded-3xl p-6 text-white shadow-xl">

        <!-- LOGOTIPO -->
        <div class="text-center">

          <span
            class="brand-logo-image mx-auto h-20 w-20"
            role="img"
            aria-label="Logo Agrozalcoalt"
          ></span>

          <h1 class="brand-title text-3xl mt-1 text-[#89e2ac]">
            Agrozalcoalt
          </h1>

          <p class="text-sm text-stone-400">
            Crea tu cuenta
          </p>

        </div>

        <!-- FORMULARIO DE REGISTRO -->
        <form
          (ngSubmit)="registrar()"
          #formulario="ngForm"
          class="mt-5 space-y-3"
        >

          <p class="text-xs uppercase tracking-widest text-stone-400">
            Datos personales
          </p>

          <!-- NOMBRE -->
          <input
            name="nombre"
            [(ngModel)]="nombre"
            placeholder="Nombre completo"
            required
            class="w-full rounded-xl border border-stone-600
                   bg-[#171717] p-3 text-white
                   outline-none focus:border-green-500"
          />

          <!-- DEPARTAMENTO Y TELÉFONO -->
          <div class="grid grid-cols-2 gap-2">

            <input
              name="departamento"
              [(ngModel)]="departamento"
              placeholder="Departamento"
              required
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white
                     outline-none focus:border-green-500"
            />

            <input
              name="telefono"
              [(ngModel)]="telefono"
              placeholder="Teléfono"
              required
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white
                     outline-none focus:border-green-500"
            />

          </div>

          <!-- DIRECCIÓN -->
          <input
            name="direccion"
            [(ngModel)]="direccion"
            placeholder="Dirección"
            required
            class="w-full rounded-xl border border-stone-600
                   bg-[#171717] p-3 text-white
                   outline-none focus:border-green-500"
          />

          <p class="pt-2 text-xs uppercase tracking-widest text-stone-400">
            Datos de cuenta
          </p>

          <!-- CORREO Y ROL -->
          <div class="grid grid-cols-2 gap-2">

            <input
              name="correo"
              [(ngModel)]="correo"
              type="email"
              placeholder="Correo electrónico"
              required
              email
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white
                     outline-none focus:border-green-500"
            />

            <select
              name="rol"
              [(ngModel)]="rol"
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white"
            >
              <option value="consumidor">Consumidor</option>
              <option value="agricultor">Agricultor</option>
            </select>

          </div>

          <!-- CONTRASEÑAS -->
          <div class="grid grid-cols-2 gap-2">

            <input
              name="password"
              [(ngModel)]="password"
              type="password"
              placeholder="Contraseña (mín. 8)"
              minlength="8"
              required
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white
                     outline-none focus:border-green-500"
            />

            <input
              name="confirmarPassword"
              [(ngModel)]="confirmarPassword"
              type="password"
              placeholder="Confirmar contraseña"
              required
              class="w-full min-w-0 rounded-xl border border-stone-600
                     bg-[#171717] p-3 text-white
                     outline-none focus:border-green-500"
            />

          </div>

          <!-- ERRORES -->
          @if (error()) {
            <p class="text-red-400 text-sm text-center" role="alert">
              {{ error() }}
            </p>
          }

          <!-- BOTÓN REGISTRAR -->
          <button
            type="submit"
            [disabled]="formulario.invalid || cargando()"
            class="w-full bg-brand text-white font-semibold
                   py-3 rounded-xl flex justify-center
                   items-center gap-2
                   disabled:opacity-50"
          >
            <span class="material-icons-round">person_add</span>

            {{ cargando() ? 'Registrando...' : 'Registrarme' }}

          </button>

        </form>

        <!-- IR AL LOGIN -->
        <p class="mt-4 text-center text-sm text-stone-400">
          ¿Ya tienes cuenta?

          <a routerLink="/login" class="text-[#89e2ac] font-semibold">
            Inicia sesión
          </a>
        </p>

      </div>

    </div>
  `
})

export class RegisterPageComponent {

    private readonly registerUser = inject(RegisterUseCase);
    private readonly router = inject(Router);

    readonly cargando = signal(false);
    readonly error = signal('');

    // DATOS PERSONALES
    nombre = '';
    departamento = '';
    telefono = '';
    direccion = '';

    // CUENTA
    correo = '';
    rol: 'agricultor' | 'consumidor' = 'consumidor';
    password = '';
    confirmarPassword = '';

    async registrar(): Promise<void> {

        if (this.cargando()) return;

        this.error.set('');

        if (
            !this.nombre.trim() ||
            !this.departamento.trim() ||
            !this.telefono.trim() ||
            !this.direccion.trim() ||
            !this.correo.trim()
        ) {
            this.error.set('Completa todos los campos.');
            return;
        }

        if (this.password.length < 8) {
            this.error.set('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (this.password !== this.confirmarPassword) {
            this.error.set('Las contraseñas no coinciden.');
            return;
        }

        this.cargando.set(true);

        try {

            await this.registerUser.execute(
                {
                    nombre: this.nombre.trim(),
                    departamento: this.departamento.trim(),
                    telefono: this.telefono.trim(),
                    direccion: this.direccion.trim(),
                    correo: this.correo.trim(),
                    rol: this.rol
                },
                this.password
            );

            await this.router.navigateByUrl('/');

        } catch (err: unknown) {

            console.error('Error al registrar:', err);

            this.error.set(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar el usuario.'
            );

        } finally {
            this.cargando.set(false);
        }
    }
}
