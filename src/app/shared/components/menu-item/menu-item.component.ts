import { Component, Input } from '@angular/core';
import { IOpcionSidebar } from '@core/models/opcion_sidebar.model';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class UiMenuItemComponent {
  @Input() item!: IOpcionSidebar;

  constructor(private router: Router){}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  } 
}
