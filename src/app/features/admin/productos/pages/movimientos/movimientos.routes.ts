import { Routes } from '@angular/router';
import { canMatchPermisoGuard } from '@core/guards/permiso.guard';

export const movimientosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./container/container.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canMatch: [canMatchPermisoGuard],
        loadComponent: () => import('./list/list.component'),
        data: {
          showAddButton: false,
        },
      },
    ],
  },
];

export default movimientosRoutes;
