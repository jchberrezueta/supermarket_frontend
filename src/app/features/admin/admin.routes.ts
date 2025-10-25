import { Routes } from '@angular/router';
import { canMatchModuleGuard } from '@core/guards/module.guard';

export const adminRoutes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'home',  
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component')
    },
    {
        path: 'bodega',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./bodega/bodega.routes')
    },
    {
        path: 'nomina',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./nomina/nomina.routes')
    },
    {
        path: 'productos',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./productos/productos.routes')
    },
    {
        path: 'proveedores',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./proveedores/proveedores.routes')
    },
    {
        path: 'seguridad',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./seguridad/seguridad.routes')
    },
    {
        path: 'ventas',
        canMatch: [canMatchModuleGuard],
        loadChildren: () => import('./ventas/ventas.routes')
    }
];

export default adminRoutes;