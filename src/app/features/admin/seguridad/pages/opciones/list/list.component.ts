import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroOpciones, ListEstadosOpcion } from 'app/models';
import { ListOpcionesConfig } from './list_opciones.config';
import { OpcionesService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiTextFieldComponent
];

type filterOpcionFormGroup = FormGroupOf<IFiltroOpciones>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListOpcionesConfig;
  private readonly _opcionesService = inject(OpcionesService);
  private formBuilder= inject(FormBuilder);
  protected opcionesNombres!: IComboBoxOption[];
  protected opcionesEstados = ListEstadosOpcion;
  protected formData!: filterOpcionFormGroup;
  private initialFormValue!: IFiltroOpciones;


  constructor() {
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideOpci: [0, [], []],
      nombreOpci: ['', [], []],
      rutaOpci: ['', [], []],
      activoOpci: ['', [], []],
      nivelOpci: [0, [], []],
      padreOpci: [0, [], []],
      iconoOpci: ['', [], []]
    }) as filterOpcionFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroOpciones;
    if (isValidStringValue(filtro.nombreOpci)) params.append('nombreOpci', filtro.nombreOpci );
    if (isValidStringValue(filtro.rutaOpci)) params.append('rutaOpci', filtro.rutaOpci );
    if (isValidStringValue(filtro.activoOpci)) params.append('activoOpci', filtro.activoOpci );
    console.log(params);
    return params;
  }


  protected refreshData(actionClick: string){
    if(actionClick === 'refresh'){
      const tableListInstance = this._tableList();
      tableListInstance.refreshData();
      this.resetForm();
    }
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}