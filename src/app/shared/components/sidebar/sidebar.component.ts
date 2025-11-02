import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { IOpcionSidebar } from '@core/models/opcion_sidebar.model';
import { MenuItemComponent } from "../menu-item/menu-item.component";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatListModule, MatIconModule, MatExpansionModule, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  opciones: IOpcionSidebar[] = [];
  
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    const rutas: IOpcionSidebar[] = this._authService.getSidebarOptions();
    if (rutas) {
      this.opciones = rutas;
      console.log(this.opciones);
    }
  }
}