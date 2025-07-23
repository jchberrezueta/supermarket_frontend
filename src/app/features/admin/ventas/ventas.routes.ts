import { Routes } from '@angular/router';

export const ventasRoutes: Routes = [
    {
        path: 'clientes',
        loadChildren: () => import('./pages/clientes/clientes.routes')
    },
    {
        path: 'ventas',
        loadChildren: () => import('./pages/ventas/ventas.routes')
    }
];

export default ventasRoutes;