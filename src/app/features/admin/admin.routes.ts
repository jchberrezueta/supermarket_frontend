import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',  
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component')
    },
    {
        path: 'bodega',
        loadChildren: () => import('./bodega/bodega.routes')
    },
    /*{
        path: 'nomina',
        loadChildren: () => import('./nomina/nomina.routes')
    },
    {
        path: 'productos',
        loadChildren: () => import('./productos/productos.routes')
    },*/
    {
        path: 'proveedores',
        loadChildren: () => import('./proveedores/proveedores.routes')
    },
    /*{
        path: 'seguridad',
        loadChildren: () => import('./seguridad/seguridad.routes')
    },
    {
        path: 'ventas',
        loadChildren: () => import('./ventas/ventas.routes')
    }*/
];

export default adminRoutes;