import { Routes } from '@angular/router';

export const sigRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'resumen-ejecutivo',
  },
  {
    path: 'resumen-ejecutivo',
    title: 'Resumen ejecutivo SIG',
    loadComponent: () =>
      import('./pages/resumen-ejecutivo/resumen-ejecutivo.component'),
  },
  {
    path: 'ventas',
    title: 'Analítica de ventas SIG',
    loadComponent: () => import('./pages/ventas/ventas.component'),
  },
  {
    path: 'inventario',
    title: 'Analítica de inventario SIG',
    loadComponent: () => import('./pages/inventario/inventario.component'),
  },
  {
    path: 'abastecimiento',
    title: 'Analítica de abastecimiento SIG',
    loadComponent: () =>
      import('./pages/abastecimiento/abastecimiento.component'),
  },
];

export default sigRoutes;
