import { Component, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { ListVentasConfig } from './list_ventas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiDatetimePickerComponent,
];

interface IFiltroVentaForm {
  numFacturaVent: string;
  estadoVent: string;
  fechaVentDesde: string;
  fechaVentHasta: string;
}

type FilterVentaFormGroup = FormGroupOf<IFiltroVentaForm>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  private readonly _tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly formBuilder = new FormBuilder();

  protected readonly config = ListVentasConfig;

  protected opcionesEstado: IComboBoxOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Completado', value: 'completado' },
    { label: 'Cancelado', value: 'cancelado' },
    { label: 'Devuelto', value: 'devuelto' },
  ];

  protected formData!: FilterVentaFormGroup;

  private initialFormValue!: IFiltroVentaForm;

  constructor() {
    this.configForm();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      numFacturaVent: ['', [], []],
      estadoVent: ['', [], []],
      fechaVentDesde: ['', [], []],
      fechaVentHasta: ['', [], []],
    }) as FilterVentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  protected filtrar(): void {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    const tableListInstance = this._tableList();
    tableListInstance.refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroVentaForm;

    this.appendParam(params, 'numFacturaVent', filtro.numFacturaVent);
    this.appendParam(params, 'estadoVent', filtro.estadoVent);
    this.appendParam(params, 'fechaVentDesde', filtro.fechaVentDesde);
    this.appendParam(params, 'fechaVentHasta', filtro.fechaVentHasta);

    return params;
  }

  private appendParam(
    params: URLSearchParams,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined) {
      return;
    }

    const stringValue = String(value).trim();

    if (stringValue === '') {
      return;
    }

    params.append(key, stringValue);
  }
}
