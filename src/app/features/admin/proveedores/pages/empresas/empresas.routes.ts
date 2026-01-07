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
                loadComponent: () => import('./list/list.component'),
                data: { showAddButton: true }
            },
            {
                path: 'insert',
                canMatch: [canMatchPermisoGuard],
                loadComponent: () => import('./form/form.component'),
                data: { showAddButton: false }
            },
            {
                path: 'update/:id',
                canMatch: [canMatchPermisoGuard],
                loadComponent: () => import('./form/form.component'),
                data: { showAddButton: false }
            },
            {
                path: 'details/:id',
                canMatch: [canMatchPermisoGuard],
                loadComponent: () => import('./details/details.component'),
                data: { showAddButton: false }
            },
            {
                path: 'precios/:id',
                canMatch: [canMatchPermisoGuard],
                loadComponent: () => import('./precios/precios.component'),
                data: { showAddButton: false }
            },
        ]
    },
];

export default empresasRoutes;