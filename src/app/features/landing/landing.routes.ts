import { Routes } from '@angular/router';

const landingRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',  
    },
    {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./pages/home/home.component')
    },
    {
        path: 'about',
        title: 'About',
        loadComponent: () => import('./pages/about/about.component')
    },
    
];

export default landingRoutes;