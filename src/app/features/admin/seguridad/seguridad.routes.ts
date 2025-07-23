import { Routes } from '@angular/router';

export const seguridadRoutes: Routes = [
    {
        path: 'accesos',
        loadChildren: () => import('./pages/accesos/accesos.routes')
    },
    {
        path: 'cuentas',
        loadChildren: () => import('./pages/cuentas/cuentas.routes')
    },
    {
        path: 'opciones',
        loadChildren: () => import('./pages/opciones/opciones.routes')
    },
    {
        path: 'perfiles',
        loadChildren: () => import('./pages/perfiles/perfiles.routes')
    }
];

export default seguridadRoutes;