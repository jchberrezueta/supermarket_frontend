import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroEmpresa, ListEstadosEmpresa } from 'app/models';
import { ListEmpresasConfig } from './list_empresas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  ReactiveFormsModule
];

type filterEmpresaFormGroup = FormGroupOf<IFiltroEmpresa>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  protected readonly title: string = 'Convenios Empresas';
  protected readonly estadosEmpresa: IComboBoxOption[] = ListEstadosEmpresa;
  protected readonly config = ListEmpresasConfig;
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  private formBuilder= inject(FormBuilder);
  protected formData!: filterEmpresaFormGroup;

  constructor() {
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreEmp: ['', [], []],
      estadoEmp: ['', [], []],
      responsableEmp: ['', [], []],
    }) as filterEmpresaFormGroup;
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEmpresa;
    if (isValidStringValue(filtro.nombreEmp)) params.append('nombreEmp', filtro.nombreEmp );
    if (isValidStringValue(filtro.estadoEmp)) params.append('estadoEmp', filtro.estadoEmp );
    if (isValidStringValue(filtro.responsableEmp)) params.append('responsableEmp', filtro.responsableEmp );
    return params;
  }
}