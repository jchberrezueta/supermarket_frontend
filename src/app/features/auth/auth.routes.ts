import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'login',  
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./pages/login/login.component')
    },
    {
        path: 'change-password',
        title: 'Actualizar Clave',
        loadComponent: () => import('./pages/change-password/change-password.component')
    }
];

export default authRoutes;