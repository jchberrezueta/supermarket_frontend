import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { UiBreadcumbsComponent } from '@shared/components/breadcumbs/breadcumbs.component';
import { IBreadcumb } from '@shared/models/breadcumb.model';
import { UiTitleComponent } from "@shared/components/title/title.component";


const breadcumbs = [
  {
    label: 'Dashboard',
    url: '/admin'
  },
  {
    label: 'Proveedores',
  },
  {
    label: 'Proveedores',
    url: '/admin/proveedores/proveedores'
  }
];

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterOutlet, UiBreadcumbsComponent, UiTitleComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export default class containerComponent {
  protected readonly title: string = 'Proveedores';
  public breadcumbs: IBreadcumb[] = breadcumbs;
  
  constructor() {
    
  }

  ngAfterViewInit() {
    
  }
}
