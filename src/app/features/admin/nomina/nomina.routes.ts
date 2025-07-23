import { Routes } from '@angular/router';

export const nominaRoutes: Routes = [
    {
        path: 'empleados',
        loadChildren: () => import('./pages/empleados/empleados.routes')
    },
    {
        path: 'roles',
        loadChildren: () => import('./pages/roles/roles.routes')
    }
];

export default nominaRoutes;