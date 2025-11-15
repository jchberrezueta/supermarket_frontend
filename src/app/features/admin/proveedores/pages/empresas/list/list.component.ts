import { Component, Input, viewChild } from '@angular/core';
import { Empresa } from '@models/proveedores';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ListEmpresasConfig } from './list_empresas.config';
import { UiTitleComponent } from "@shared/components/title/title.component";
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    UiTableListComponent,
    UiButtonComponent,
    UiTitleComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent
],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {

  title:string = 'Convenios Empresas';
  config = ListEmpresasConfig;
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  titulo:string = '';

  imprimir(event: any): void{
    console.log(event);
    console.log(typeof(event));
  }

  search() {
    const tableListInstance = this._tableList();
    console.log(tableListInstance.update());
  }

}
