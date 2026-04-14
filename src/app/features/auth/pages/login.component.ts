
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Caso de uso encargado de iniciar sesión.
import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';

@Component({
  selector: 'app-login',

  // Permite utilizar [(ngModel)] para leer los campos.
  imports: [FormsModule],

  template: `
    <!-- CONTENEDOR PRINCIPAL -->
    <div class="min-h-screen bg-brand grid place-items-center p-4">

      <!-- TARJETA DEL LOGIN: conserva los estilos existentes -->
      <div class="w-full max-w-sm bg-white rounded-3xl p-6">

        <!-- ENCABEZADO Y LOGOTIPO -->
        <div class="text-center">
          <span
            class="brand-logo-image mx-auto h-20 w-20"
            role="img"
            aria-label="Logo Agrozalcoalt"
          ></span>
        </div>

        <h1 class="brand-title text-center text-3xl mt-1 text-brand">
          Agrozalcoalt
        </h1>

        <p class="text-center text-sm text-stone-500">
          Inicia sesión
        </p>

        <!-- FORMULARIO DE INICIO DE SESIÓN -->
        <div class="mt-4 space-y-3">

          <!-- Correo electrónico del usuario -->
          <input
            [(ngModel)]="email"
            type="email"
            placeholder="Correo"
            class="w-full rounded-xl border border-stone-300 p-3"
          />

          <!-- Contraseña del usuario -->
          <input
            [(ngModel)]="password"
            type="password"
            placeholder="Contraseña"
            class="w-full rounded-xl border border-stone-300 p-3"
          />

          <!-- Muestra errores si falla la autenticación -->
          @if (error()) {
            <p class="text-center text-sm text-red-500" role="alert">
              {{ error() }}
            </p>
          }

          <!-- Ejecuta el inicio de sesión -->
          <button
            type="button"
            (click)="entrar()"
            [disabled]="cargando()"
            class="w-full bg-brand text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <span class="material-icons-round">login</span>
            {{ cargando() ? 'Ingresando...' : 'Entrar' }}
          </button>

        </div>

        <!-- NAVEGA AL COMPONENTE DE REGISTRO -->
        <button
          type="button"
          (click)="irRegistro()"
          class="mt-4 w-full text-sm text-earth"
        >
          ¿No tienes cuenta? Regístrate
        </button>

      </div>
    </div>
  `,
})

export class LoginPageComponent {

  // SERVICIOS Y CASOS DE USO

  // Permite cambiar entre páginas de Angular.
  private readonly router = inject(Router);

  // Ejecuta la autenticación mediante AuthRepository.
  private readonly login = inject(LoginUseCase);

  // VARIABLES DEL FORMULARIO

  // Reciben los valores escritos por el usuario.
  email = '';
  password = '';

  // Controla si se está procesando el inicio de sesión.
  readonly cargando = signal(false);

  // Guarda el mensaje de error para mostrarlo en pantalla.
  readonly error = signal('');

  // NAVEGACIÓN AL REGISTRO
  irRegistro(): void {

    // Abre la ruta del componente RegisterPageComponent.
    void this.router.navigateByUrl('/registro');
  }

  // INICIO DE SESIÓN
  async entrar(): Promise<void> {

    // Evita enviar dos solicitudes simultáneas.
    if (this.cargando()) return;

    // Limpia errores anteriores.
    this.error.set('');

    // Comprueba que ambos campos tengan información.
    if (!this.email.trim() || !this.password) {
      this.error.set('Ingresa tu correo y contraseña.');
      return;
    }

    // Indica que está procesando la autenticación.
    this.cargando.set(true);

    try {

      // Solicita al caso de uso iniciar sesión con Firebase.
      await this.login.execute(
        this.email.trim(),
        this.password
      );

      // Si el inicio de sesión fue exitoso, abre Inicio.
      await this.router.navigateByUrl('/');

    } catch (error: unknown) {

      // Registra el error técnico en la consola.
      console.error('Error al iniciar sesión:', error);

      // Presenta un mensaje comprensible al usuario.
      this.error.set(
        'No se pudo iniciar sesión. Verifica tus credenciales.'
      );

    } finally {

      // Habilita nuevamente el botón.
      this.cargando.set(false);
    }
  }
}
