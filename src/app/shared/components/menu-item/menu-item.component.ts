import { Component, inject, input, Input } from '@angular/core';
import { IOpcionSidebar } from '@core/models/opcion_sidebar.model';
import { Router, RouterLink } from "@angular/router";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'ui-menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: [MatExpansionModule, MatIcon, MatListModule],
})
export class UiMenuItemComponent {
  public item = input.required<IOpcionSidebar>();
  private _router = inject(Router);


  public get elem(): IOpcionSidebar {
    return this.item();
  }

  public navigateToUrl(url: string) {
    this._router.navigate([url]);
  } 
}
