import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'login',  
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./pages/login/login.component')
    }
];

export default authRoutes;