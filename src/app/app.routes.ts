import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full', 
      redirectTo: 'auth'
    },
    { 
      path: 'auth', 
      title: 'Login',
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


/*
import { RoleGuard } from './guards/role.guard';
import LoginComponent from './features/auth/pages/login/login.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'vendedor',
    component: VendedorComponent,
    canActivate: [RoleGuard],
    data: { roles: ['vendedor'] }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];

*/