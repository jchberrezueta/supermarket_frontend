import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full', 
      redirectTo: 'auth'
    },
    { 
      path: 'auth', 
      loadChildren: () => import('./features/auth/auth.routes')  
    },
    {
      path: 'admin',
      title: 'SuperMarket',
      loadComponent: () => import('./layout/layouts/admin/admin.component'),
      loadChildren: () => import('./features/admin/admin.routes')
    },
    {
      path: 'landing',
      title: 'Inicio',
      loadComponent: () => import('./layout/layouts/landing/landing.component'),
      loadChildren: () => import('./features/landing/landing.routes')
    },
    {
      path: 'inexistente',
      title: 'Pagina no encontrada',
      loadComponent: () => import('./features/landing/pages/inexistente/inexistente.component')
    },
    {
      path: '**',
      redirectTo: 'inexistente'    
    },
];