import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',  
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component')
    }
];

export default authRoutes;