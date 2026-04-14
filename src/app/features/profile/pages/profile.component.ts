import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuarios as UserProfile } from '../../../core/domain/models/user.model';
import { LogoutUseCase } from '../../../core/use-cases/auth/logout.use-case';
import { GetUserProfileUseCase } from '../../../core/use-cases/user/get-user.profile.use-case';
import { AuthSessionService } from '../../../shared/services/auth-session.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  template: `
    @if (profile(); as user) {
      <div class="text-center">
        <div class="mx-auto w-24 h-24 rounded-full bg-earth text-white grid place-items-center">
          <span class="material-icons-round text-5xl">agriculture</span>
        </div>
        <h1 class="mt-3 text-xl font-bold">{{ user.nombre }}</h1>
        <p class="text-sm text-earth">{{ user.rol }} · {{ user.departamento }}</p>
      </div>

      <div class="grid grid-cols-3 gap-3 mt-5 text-center">
        <p class="text-brand">—</p>
        <p class="text-xs">Productos</p>
        <p class="text-brand">—</p>
<p class="text-xs">Pedidos</p>
<p class="text-brand">—</p>
<p class="text-xs">Pedidos</p>
      </div>
    }

    <a routerLink="/publicar" class="mt-5 flex justify-center items-center gap-2 text-center bg-accent text-stone-900 font-semibold py-3 rounded-xl">
      <span class="material-icons-round">add_circle</span>
      Publicar producto
    </a>

    <button (click)="salir()" class="mt-3 w-full flex justify-center items-center gap-2 text-center border border-stone-300 py-3 rounded-xl">
      <span class="material-icons-round">logout</span>
      Cerrar sesión
    </button>
  `,
})

export class ProfilePageComponent implements OnInit {

  private readonly getUserProfile = inject(GetUserProfileUseCase);
  private readonly logout = inject(LogoutUseCase);
  private readonly router = inject(Router);
  private readonly authSession = inject(AuthSessionService);

  readonly profile = signal<UserProfile | null>(null);

  async ngOnInit() {
    try {
      const uid = await this.authSession.obtenerUid();

      if (!uid) {
        await this.router.navigateByUrl('/login');
        return;
      }

      const usuario = await this.getUserProfile.execute(uid);
      this.profile.set(usuario);

    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  async salir() {
    await this.logout.execute();
    await this.router.navigateByUrl('/login');
  }
}
