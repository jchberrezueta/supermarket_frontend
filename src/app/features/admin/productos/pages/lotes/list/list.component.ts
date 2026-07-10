import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf, isValidStringValue } from '@core/utils/utilities';
import { LotesService } from '@services/lotes.service';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { ListLotesConfig } from './list_lotes.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
  UiDatetimePickerComponent,
];

interface IFiltroLoteForm {
  ideProd: number | string;
  estadoLote: string;
  fechaCaducidadDesde: string;
  fechaCaducidadHasta: string;
}

type FilterLoteFormGroup = FormGroupOf<IFiltroLoteForm>;

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

  private readonly _lotesService = inject(LotesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListLotesConfig;

  protected opcionesProductos: IComboBoxOption[] = [];
  protected opcionesEstados: IComboBoxOption[] = [];

  protected formData!: FilterLoteFormGroup;

  private initialFormValue!: IFiltroLoteForm;

  constructor() {
    this.configForm();
    this.loadComboProductos();
    this.loadComboEstados();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideProd: [-1, [], []],
      estadoLote: ['', [], []],
      fechaCaducidadDesde: ['', [], []],
      fechaCaducidadHasta: ['', [], []],
    }) as FilterLoteFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboProductos(): void {
    this._lotesService.listarComboProductos().subscribe((res) => {
      this.opcionesProductos = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._lotesService.listarComboEstados().subscribe((res) => {
      this.opcionesEstados = res ?? [];
    });
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
    const filtro = this.formData.value as IFiltroLoteForm;

    this.appendParam(params, 'ideProd', filtro.ideProd);
    this.appendParam(params, 'estadoLote', filtro.estadoLote);

    if (isValidStringValue(filtro.fechaCaducidadDesde)) {
      params.append('fechaCaducidadLoteDesde', filtro.fechaCaducidadDesde);
    }

    if (isValidStringValue(filtro.fechaCaducidadHasta)) {
      params.append('fechaCaducidadLoteHasta', filtro.fechaCaducidadHasta);
    }

    return params;
  }

  private appendParam(
    params: URLSearchParams,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined || value === -1) {
      return;
    }

    const stringValue = String(value).trim();

    if (stringValue === '') {
      return;
    }

    params.append(key, stringValue);
  }
}
