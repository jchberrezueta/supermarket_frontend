import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { UiBreadcumbsComponent } from '@shared/components/breadcumbs/breadcumbs.component';
import { IBreadcumb } from '@shared/models/breadcumb.model';


const datos = [
      {
        label: 'Dashboard',
        url: ''
      },
      {
        label: 'Proveedores',
        url: ''
      },
      {
        label: 'Empresas',
        url: ''
      }
    ];

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterOutlet, UiBreadcumbsComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export default class containerComponent {
  
  public breadcumbs: IBreadcumb[] = datos;
  
  constructor() {
    
  }

  ngAfterViewInit() {
    
  }
}
