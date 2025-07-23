import { Routes } from '@angular/router';

export const proveedoresRoutes: Routes = [
    {
        path: 'empresas',
        title: 'Empresas',
        loadChildren: () => import('./pages/empresas/empresas.routes'),
        /*resolve: {
            empresas: () => inject(EmpresaService).getEmpresas(),
        },*/
    },
    {
        path: 'proveedores',
        title: 'Proveedores',
        loadChildren: () => import('./pages/proveedores/proveedores.routes')
    }
    
];

export default proveedoresRoutes;