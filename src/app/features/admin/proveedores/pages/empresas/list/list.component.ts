import { Component, inject, viewChild } from '@angular/core';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ListEmpresasConfig } from './list_empresas.config';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { quitarVaciosObjeto } from '@core/utils/utilities';
import { IFiltroEmpresa } from '@models/proveedores';
import { isValidStringValue } from '../../../../../../core/utils/utilities';


const estadosList = [
  {
    value: 'activo',
    label: 'activo'
  },
  {
    value: 'inactivo',
    label: 'inactivo'
  },
]

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  ReactiveFormsModule
];

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  protected readonly estados: IComboBoxOption[] = estadosList;
  protected readonly title: string = 'Convenios Empresas';
  protected readonly config = ListEmpresasConfig;
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  private formBuilder= inject(FormBuilder);
  protected formData!: FormGroup;

  constructor() {
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreEmp: ['', [Validators.required], []],
      responsableEmp: ['', [Validators.required], []],
      estadoEmp: ['', [Validators.required], []],
    });
  }

  protected buscar() {
    console.log('VAMOS :)');
    console.log(this.formData.value);
    console.log(this.getParams());
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected getParams(): any {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEmpresa;
    if (isValidStringValue(filtro.nombreEmp)) params.append('nombreEmp', filtro.nombreEmp );
    if (isValidStringValue(filtro.estadoEmp)) params.append('estadoEmp', filtro.estadoEmp );
    if (isValidStringValue(filtro.responsableEmp)) params.append('responsableEmp', filtro.responsableEmp );
    return params;
  }
}