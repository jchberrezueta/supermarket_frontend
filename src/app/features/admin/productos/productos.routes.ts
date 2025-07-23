import { Routes } from '@angular/router';

export const productosRoutes: Routes = [
    {
        path: 'categorias',
        loadChildren: () => import('./pages/categorias/categorias.routes')
    },
    {
        path: 'lotes',
        loadChildren: () => import('./pages/lotes/lotes.routes')
    },
    {
        path: 'marcas',
        loadChildren: () => import('./pages/marcas/marcas.routes')
    },
    {
        path: 'productos',
        loadChildren: () => import('./pages/productos/productos.routes')
    }
];

export default productosRoutes;