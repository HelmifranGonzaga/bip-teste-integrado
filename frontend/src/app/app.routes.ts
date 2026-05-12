import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { BeneficiosComponent } from './features/beneficios/beneficios.component';
import { BeneficioCreateComponent } from './features/beneficios/pages/beneficio-create/beneficio-create.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/beneficios',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'beneficios/novo',
    component: BeneficioCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'beneficios',
    component: BeneficiosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'usuarios',
    component: UsersComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/beneficios'
  }
];
