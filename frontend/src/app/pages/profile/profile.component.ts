import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule, DividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly user = toSignal(this.authService.getAuthUser$());

  editProfile(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Perfil',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  changePassword(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Alterar Senha',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }
}