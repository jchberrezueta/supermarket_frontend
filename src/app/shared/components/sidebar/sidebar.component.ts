import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Importa esto
import { AuthService } from '@core/services/auth.service';
import { MenuItem } from '@shared/models/menu_item.model';

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', route: '/admin/home', permission: 'todos' },

  { label: 'Empresas', route: '/admin/proveedores/empresas/list', permission: 'bodega' },
  { label: 'Proveedores', route: '/admin/proveedores/proveedores/list', permission: 'bodega' },

  { label: 'Entregas', route: '/admin/bodega/entregas/list', permission: 'bodega' },
  { label: 'Pedidos', route: '/admin/bodega/pedidos/list', permission: 'bodega' },

  { label: 'Categorias', route: '/admin/productos/categorias/list', permission: 'inventario' },
  { label: 'Marcas', route: '/admin/productos/marcas/list', permission: 'inventario' },
  { label: 'Productos', route: '/admin/productos/productos/list', permission: 'inventario' },
  { label: 'Lotes', route: '/admin/productos/lotes/list', permission: 'inventario' },

  { label: 'Empleados', route: '/admin/nomina/empleados/list', permission: 'nomina' },
  { label: 'Roles', route: '/admin/nomina/roles/list', permission: 'nomina' },

  { label: 'Clientes', route: '/admin/ventas/clientes/list', permission: 'ventas' },
  { label: 'Ventas', route: '/admin/ventas/ventas/list', permission: 'ventas' },

  { label: 'Opciones', route: '/admin/seguridad/opciones/list', permission: 'seguridad' },
  { label: 'Perfiles', route: '/admin/seguridad/perfiles/list', permission: 'seguridad' },
  { label: 'Cuentas', route: '/admin/seguridad/cuentas/list', permission: 'seguridad' },
  { label: 'Accesos', route: '/admin/seguridad/accesos/list', permission: 'seguridad' },
];
interface Permiso {
  ruta: string;
  listar: boolean;
  insertar: boolean;
  modificar: boolean;
  eliminar: boolean;
  activo: boolean;
}

interface Usuario {
  id: number;
  username: string;
  state: string;
  perfil: string;
  permisos: Permiso[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: MenuItem[] = MENU_ITEMS;
  userPermissions: MenuItem[] = [];

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    const userPermissions: Usuario | null = this._authService.getUser();
    if (userPermissions && userPermissions.permisos) {
      const allowedRoutes = userPermissions.permisos
        .filter(p => p.listar && p.activo)
        .map(p => p.ruta);
        console.log(allowedRoutes);
      this.userPermissions = this.menuItems.filter(item => allowedRoutes.includes(item.route));
      console.log(this.userPermissions);
    }
  }
}