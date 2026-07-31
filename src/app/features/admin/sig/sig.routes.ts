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
      import(
        './pages/resumen-ejecutivo/resumen-ejecutivo.component'
      ),
  },
];

export default sigRoutes;
