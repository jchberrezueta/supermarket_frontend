import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { IOpcionSidebar } from '@core/models/opcion_sidebar.model';
import { UiMenuItemComponent } from "../menu-item/menu-item.component";
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

const COMPONENTES = [
  UiMenuItemComponent,
]

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
  styleUrl: './sidebar.component.scss'
})
export class UiSidebarComponent {
  opciones: IOpcionSidebar[] = [];
  
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    const rutas: IOpcionSidebar[] = this._authService.getSidebarOptions();
    if (rutas) {
      this.opciones = rutas;
      console.log('SIDEBAR');
      console.log(this.opciones);
    }
  }
}