import { Routes } from '@angular/router';

export const proveedoresRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'empresas',  
    },
    {
        path: 'empresas',
        title: 'Empresas',
        loadChildren: () => import('./pages/empresas/empresas.routes')
    },
    {
        path: 'proveedores',
        loadChildren: () => import('./pages/proveedores/proveedores.routes')
    }
    
];

export default proveedoresRoutes;