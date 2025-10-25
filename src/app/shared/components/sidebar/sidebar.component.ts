import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Importa esto
import { IRuta } from '@core/models/rutas.model';
import { AuthService } from '@core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatListModule, MatIconModule, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  userPermissions: IRuta[] = [];
  menus = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard'
    },
    {
      title: 'Inventario',
      icon: 'inventory_2',
      children: [
        { title: 'Productos', icon: 'category', link: '/productos' },
        { title: 'Proveedores', icon: 'local_shipping', link: '/proveedores' }
      ]
    },
    {
      title: 'Usuarios',
      icon: 'account_circle',
      children: [
        { title: 'Lista', icon: 'people', link: '/usuarios/lista' },
        { title: 'Roles', icon: 'admin_panel_settings', link: '/usuarios/roles' }
      ]
    },
    {
      title: 'Reportes',
      icon: 'bar_chart',
      link: '/reportes'
    }
  ];
  
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    const userPermissions: IRuta[] = this._authService.getUserPermisosRutas();
    if (userPermissions) {
      const allowedRoutes = userPermissions.filter(p => p.activo);
      this.userPermissions = allowedRoutes;
      console.log(allowedRoutes);
    }
  }
}