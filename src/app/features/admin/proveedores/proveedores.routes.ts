import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { EmpresaService } from '@services/index';

export const proveedoresRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'empresas',  
    },
    {
        path: 'empresas',
        title: 'Empresas',
        loadChildren: () => import('./pages/empresas/empresas.routes'),
        resolve: {
            empresas: () => inject(EmpresaService).getEmpresas(),
        },
    },
    {
        path: 'proveedores',
        title: 'Proveedores',
        loadChildren: () => import('./pages/proveedores/proveedores.routes')
    }
    
];

export default proveedoresRoutes;