import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroCliente } from 'app/models';
import { ListClientesConfig } from './list_clientes.config';
import { ClientesService } from '@services/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiTextFieldComponent
];

interface IFiltroClienteForm {
  cedulaClie: string;
  primerNombreClie: string;
  esSocio: string;
}

type filterClienteFormGroup = FormGroupOf<IFiltroClienteForm>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListClientesConfig;
  private readonly _clientesService = inject(ClientesService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  protected opcionesSocio: IComboBoxOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' }
  ];
  protected formData!: filterClienteFormGroup;
  private initialFormValue!: IFiltroClienteForm;

  constructor() {
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      cedulaClie: ['', [], []],
      primerNombreClie: ['', [], []],
      esSocio: ['', [], []]
    }) as filterClienteFormGroup;
    this.initialFormValue = this.formData.getRawValue();
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroClienteForm;
    if (isValidStringValue(filtro.cedulaClie)) params.append('cedulaClie', filtro.cedulaClie);
    if (isValidStringValue(filtro.primerNombreClie)) params.append('primerNombreClie', filtro.primerNombreClie);
    if (isValidStringValue(filtro.esSocio)) params.append('esSocio', filtro.esSocio);
    return params;
  }

  protected limpiar() {
    this.formData.reset(this.initialFormValue);
    this._tableList().refreshData();
  }

  protected refreshData(event: any) {
    this._tableList().refreshData();
  }
}
