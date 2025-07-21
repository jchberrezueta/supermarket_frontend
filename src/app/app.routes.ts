import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin',  
    },
    {
        path: 'landing',
        loadComponent: () => import('./layout/layouts/landing/landing.component'),
        loadChildren: () => import('./features/landing/landing.routes')
    },
    {
        path: 'admin',
        title: 'SuperMarket',
        loadComponent: () => import('./layout/layouts/admin/admin.component'),
        loadChildren: () => import('./features/admin/admin.routes')
    }
];