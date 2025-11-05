import { Component, Input } from '@angular/core';
import { Empresa } from '@models/proveedores';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ListEmpresasConfig } from './list_empresas.config';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    UiTableListComponent, 
    UiButtonComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {

  config = ListEmpresasConfig;

  imprimir(event: any): void{
    console.log(event);
  }
}
