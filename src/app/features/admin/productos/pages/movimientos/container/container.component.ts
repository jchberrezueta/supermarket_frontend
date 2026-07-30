import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiBreadcumbsComponent } from '@shared/components/breadcumbs/breadcumbs.component';
import { UiTitleComponent } from '@shared/components/title/title.component';
import { IBreadcumb } from '@shared/models/breadcumb.model';

@Component({
  selector: 'app-container-movimientos',
  standalone: true,
  imports: [RouterOutlet, UiBreadcumbsComponent, UiTitleComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export default class ContainerComponent {
  protected readonly title = 'Movimientos de inventario';
  protected readonly showAddButton = false;

  public readonly breadcumbs: IBreadcumb[] = [
    {
      label: 'Dashboard',
      url: '/admin',
    },
    {
      label: 'Módulo Productos',
    },
    {
      label: 'Movimientos de inventario',
      url: '/admin/productos/movimientos',
    },
  ];
}
