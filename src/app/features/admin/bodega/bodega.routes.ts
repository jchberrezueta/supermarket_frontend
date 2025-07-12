import { Routes } from '@angular/router';

export const bodegaRoutes: Routes = [
    {
        path: 'entregas',
        loadChildren: () => import('./pages/entregas/entregas.routes')
    },
    {
        path: 'pedidos',
        loadChildren: () => import('./pages/pedidos/pedidos.routes')
    }
];

export default bodegaRoutes;