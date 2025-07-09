import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'landing',  
    },
    {
        path: 'landing',
        loadChildren: () => import('./features/landing/landing.routes')
    }
    
];
