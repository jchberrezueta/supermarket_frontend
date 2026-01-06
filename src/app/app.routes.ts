import { Routes } from '@angular/router';
import { canMatchAutgGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
      path: '', pathMatch: 'full', redirectTo: 'auth'
    },
    { 
      path: 'auth', 
      loadComponent: () => import('./layout/layouts/auth/auth-layout.component'),
      loadChildren: () => import('./features/auth/auth.routes')  
    },
    {
      path: 'admin',
      title: 'SuperMarket',
      canMatch: [canMatchAutgGuard],
      loadComponent: () => import('./layout/layouts/admin/admin-layout.component'),
      loadChildren: () => import('./features/admin/admin.routes')
    },
    {
      path: 'landing',
      title: 'Inicio',
      loadComponent: () => import('./layout/layouts/landing/landing-layout.component'),
      loadChildren: () => import('./features/landing/landing.routes')
    },
    {
      path: 'inexistente',
      title: 'Pagina no encontrada',
      loadComponent: () => import('./shared/components/inexistente/inexistente.component')
    },
    {
      path: 'no-autorizado',
      title: 'No Autorizado',
      loadComponent: () => import('./shared/components/no-autorizado/no-autorizado.component')
    },
    {
      path: '**', redirectTo: 'inexistente'    
    },
];