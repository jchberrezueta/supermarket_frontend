import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
   @Input() permisos: any[] = [];

  puedeVer(ruta: string): boolean {
    return this.permisos.some(p => p.RUTA_OPCI === ruta && p.ACTIVO_OPCI === 'SI');
  }
}
