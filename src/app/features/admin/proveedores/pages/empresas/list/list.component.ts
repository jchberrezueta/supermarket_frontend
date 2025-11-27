import { Component, viewChild } from '@angular/core';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ListEmpresasConfig } from './list_empresas.config';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { FormsModule } from '@angular/forms';


const estadosList = [
  {
    id: 1,
    value: 'activo'
  },
  {
    id: 2,
    value: 'inactivo'
  },
]

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiDatetimePickerComponent,
  UiTextFieldComponent,
  FormsModule
];
@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {

  protected readonly title: string = 'Convenios Empresas';
  protected readonly estados: IComboBoxOption[] = estadosList;
  protected readonly config = ListEmpresasConfig;
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);

  public id!: number;
  public empresa!: string;
  public responsable!: string;
  public estado!: number;
  public fechaContrato!: Date;

  imprimir(event: any): void{
    console.log(event);
    console.log('tipo');
    console.log(typeof(event));
  }

  public getParams(): any[] {
    let params = [];
    if(this.id) params.push(this.id);
    if(this.empresa) params.push(this.empresa);
    if(this.responsable) params.push(this.responsable);
    if(this.estado) params.push(this.estado);
    if(this.fechaContrato) params.push(this.fechaContrato.toLocaleDateString());

    return params;
  }



  search() {
    console.log('VAMOS :)');
    const params = this.getParams();
    console.log(params);
    /*const tableListInstance = this._tableList();
    console.log(tableListInstance.update());*/
  }

  protected setId(value:string){
    if(!isNaN(+value)){
      this.id = +value;
    }else{
      //validar que debe ingresar numeros porfavor :)
    }
  }
  protected setEmpresa(value:string){
    this.empresa = value;
  }
  protected setResponsable(value:string){
    this.responsable = value;
  }
  protected setEstado(value:number){
    this.estado = value;
  }
  protected setFechaContrato(value:Date){
    this.fechaContrato = value;
  }
}