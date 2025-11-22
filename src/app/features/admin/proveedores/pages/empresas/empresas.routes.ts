import { Routes } from '@angular/router';
import { canMatchPermisoGuard } from '@core/guards/permiso.guard';

export const empresasRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./container/container.component'),
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'list'
            },
            {
                path: 'list',
                canMatch: [canMatchPermisoGuard],
                loadComponent: () => import('./list/list.component')
            }
        ]
    },
    {
        path: 'insert',
        canMatch: [canMatchPermisoGuard],
        loadComponent: () => import('./form/form.component'),
    },
    {
        path: 'update/:id',
        canMatch: [canMatchPermisoGuard],
        loadComponent: () => import('./form/form.component'),
    },
    {
        path: 'details/:id',
        canMatch: [canMatchPermisoGuard],
        loadComponent: () => import('./details/details.component'),
    }
];

export default empresasRoutes;