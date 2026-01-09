import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { ListVentasConfig } from './list_ventas.config';
import { VentasService } from '@services/ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiDatetimePickerComponent
];

interface IFiltroVentaForm {
  numFacturaVent: string;
  estadoVent: string;
  fechaVentDesde: string;
  fechaVentHasta: string;
}

type filterVentaFormGroup = FormGroupOf<IFiltroVentaForm>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListVentasConfig;
  private readonly _ventasService = inject(VentasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  protected opcionesEstado: IComboBoxOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Completado', value: 'completado' },
    { label: 'Cancelado', value: 'cancelado' },
    { label: 'Devuelto', value: 'devuelto' }
  ];
  protected formData!: filterVentaFormGroup;
  private initialFormValue!: IFiltroVentaForm;

  constructor() {
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      numFacturaVent: ['', [], []],
      estadoVent: ['', [], []],
      fechaVentDesde: ['', [], []],
      fechaVentHasta: ['', [], []]
    }) as filterVentaFormGroup;
    this.initialFormValue = this.formData.getRawValue();
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroVentaForm;
    if (isValidStringValue(filtro.numFacturaVent)) params.append('numFacturaVent', filtro.numFacturaVent);
    if (isValidStringValue(filtro.estadoVent)) params.append('estadoVent', filtro.estadoVent);
    if (isValidStringValue(filtro.fechaVentDesde)) params.append('fechaVentDesde', filtro.fechaVentDesde);
    if (isValidStringValue(filtro.fechaVentHasta)) params.append('fechaVentHasta', filtro.fechaVentHasta);
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
