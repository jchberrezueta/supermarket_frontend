import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'forgot-password',
    title: 'Recuperar contraseña',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component'),
  },
  {
    path: 'reset-password',
    title: 'Restablecer contraseña',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component'),
  },
  {
    path: 'change-password',
    title: 'Actualizar contraseña',
    loadComponent: () =>
      import('./pages/change-password/change-password.component'),
  },
  {
    path: 'mfa',
    title: 'Verificación en dos pasos',
    loadComponent: () => import('./pages/mfa-login/mfa-login.component'),
  },
];

export default authRoutes;
