import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../core/use-cases/auth/register.use-case';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-brand grid place-items-center p-4">
      <div class="w-full max-w-sm bg-white rounded-3xl p-6">
        <div class="text-center">
          <span
            class="brand-logo-image mx-auto h-20 w-20"
            role="img"
            aria-label="Logo Agrozalcoalt"
          ></span>
        </div>
        <h1 class="brand-title text-center text-3xl mt-1 text-brand">Agrozalcoalt</h1>
        <p class="text-center text-sm text-stone-500">{{ registro() ? 'Crea tu cuenta' : 'Inicia sesión' }}</p>

        <div class="mt-4 space-y-3">
          @if (registro()) {
            <input [(ngModel)]="nombre" placeholder="Nombre completo" class="w-full rounded-xl border border-stone-300 p-3" />
            <select [(ngModel)]="rol" class="w-full rounded-xl border border-stone-300 p-3">
              <option>Agricultor</option>
              <option>Comprador</option>
            </select>
          }

          <input [(ngModel)]="email" type="email" placeholder="Correo" class="w-full rounded-xl border border-stone-300 p-3" />
          <input [(ngModel)]="password" type="password" placeholder="Contraseña" class="w-full rounded-xl border border-stone-300 p-3" />

          <button (click)="entrar()" class="w-full bg-brand text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
            <span class="material-icons-round">{{ registro() ? 'person_add' : 'login' }}</span>
            {{ registro() ? 'Registrarme' : 'Entrar' }}
          </button>
        </div>

        <button (click)="registro.set(!registro())" class="mt-4 w-full text-sm text-earth">
          {{ registro() ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
        </button>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly login = inject(LoginUseCase);
  private readonly registerUser = inject(RegisterUseCase);

  readonly registro = signal(false);
  nombre = '';
  rol: 'Agricultor' | 'Comprador' = 'Agricultor';
  email = '';
  password = '';

  async entrar() {
    if (this.registro()) {
      await this.registerUser.execute({
        nombre: this.nombre,
        rol: this.rol,
        email: this.email,
        password: this.password,
      });
    } else {
      await this.login.execute({ email: this.email, password: this.password });
    }

    await this.router.navigateByUrl('/');
  }
}
