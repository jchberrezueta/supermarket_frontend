import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { IOpcionSidebar } from '@core/models/index';
import { UiMenuItemComponent } from '../menu-item/menu-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

const MODULOS_MATERIAL = [
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatExpansionModule,
];

const COMPONENTES = [UiMenuItemComponent];

const IMPORTACIONES = [
  RouterModule,
  CommonModule,
  COMPONENTES,
  MODULOS_MATERIAL,
];

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: IMPORTACIONES,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class UiSidebarComponent {
  private readonly _authService = inject(AuthService);

  protected opciones: IOpcionSidebar[] = [];

  ngOnInit(): void {
    const rutas: IOpcionSidebar[] = [
      ...(this._authService.getSidebarOptions() ?? []),
    ];

    const esAdministrador = this._authService.getUserPerfil() === 'padmin';

    if (esAdministrador && !this.contieneRuta(rutas, 'admin/home')) {
      rutas.unshift({
        id: 0,
        titulo: 'Dashboard',
        ruta: 'admin/home',
        icono: 'dashboard',
        activo: 'si',
        hijas: [],
        visible: true,
      });
    }

    if (
      esAdministrador &&
      !this.contieneRuta(rutas, 'admin/sig/resumen-ejecutivo')
    ) {
      const opcionSig: IOpcionSidebar = {
        id: -1,
        titulo: 'SIG Gerencial',
        ruta: 'admin/sig',
        icono: 'analytics',
        activo: 'si',
        visible: true,
        hijas: [
          {
            id: -11,
            titulo: 'Resumen ejecutivo',
            ruta: 'admin/sig/resumen-ejecutivo',
            icono: 'dashboard',
            activo: 'si',
            hijas: [],
            visible: true,
          },
          {
            id: -12,
            titulo: 'Analítica de ventas',
            ruta: 'admin/sig/ventas',
            icono: 'monitoring',
            activo: 'si',
            hijas: [],
            visible: true,
          },
          {
            id: -13,
            titulo: 'Analítica de inventario',
            ruta: 'admin/sig/inventario',
            icono: 'inventory_2',
            activo: 'si',
            hijas: [],
            visible: true,
          },
          {
            id: -14,
            titulo: 'Abastecimiento',
            ruta: 'admin/sig/abastecimiento',
            icono: 'local_shipping',
            activo: 'si',
            hijas: [],
            visible: true,
          },
        ],
      };

      const posicionDashboard = rutas.findIndex(
        (ruta) => ruta.ruta === 'admin/home',
      );

      if (posicionDashboard >= 0) {
        rutas.splice(posicionDashboard + 1, 0, opcionSig);
      } else {
        rutas.unshift(opcionSig);
      }
    }

    this.opciones = rutas;
  }

  private contieneRuta(
    opciones: IOpcionSidebar[],
    rutaBuscada: string,
  ): boolean {
    return opciones.some(
      (opcion) =>
        opcion.ruta === rutaBuscada ||
        this.contieneRuta(opcion.hijas ?? [], rutaBuscada),
    );
  }
}
