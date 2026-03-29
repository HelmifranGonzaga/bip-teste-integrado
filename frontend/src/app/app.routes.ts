import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BeneficiosComponent } from './features/beneficios/beneficios.component';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'beneficios',
    component: BeneficiosComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/beneficios'
  }
];
