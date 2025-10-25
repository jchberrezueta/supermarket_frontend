import { Routes } from '@angular/router';
import { canMatchModuleGuard } from '@core/guards/module.guard';

export const proveedoresRoutes: Routes = [
    {
        path: 'empresas',
        title: 'Empresas',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./pages/empresas/empresas.routes')
    },
    {
        path: 'proveedores',
        title: 'Proveedores',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./pages/proveedores/proveedores.routes')
    }
];

export default proveedoresRoutes;