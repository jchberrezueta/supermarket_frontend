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
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UiBreadcumbsComponent],
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export default class RootComponent {
  
  public breadcumbs: IBreadcumb[] = datos;
  
  constructor() {
    
  }

  ngAfterViewInit() {
    
  }
}
