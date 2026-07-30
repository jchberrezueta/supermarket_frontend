import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf, isValidStringValue } from '@core/utils/utilities';
import { MovimientosInventarioService } from '@services/movimientos-inventario.service';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { ListMovimientosConfig } from './list_movimientos.config';

interface IFiltroMovimientoForm {
  ideProd: number | string;
  ideLote: number | string;
  tipoMovi: string;
  fechaDesde: string;
  fechaHasta: string;
  usuaIngre: string;
}

type FilterMovimientoFormGroup = FormGroupOf<IFiltroMovimientoForm>;

@Component({
  selector: 'app-list-movimientos',
  standalone: true,
  imports: [
    UiTableListComponent,
    UiButtonComponent,
    UiCardComponent,
    ReactiveFormsModule,
    UiInputBoxComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent,
    UiTextFieldComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  private readonly tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly movimientosService = inject(MovimientosInventarioService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListMovimientosConfig;
  protected opcionesProductos: IComboBoxOption[] = [];
  protected opcionesTipos: IComboBoxOption[] = [];
  protected formData!: FilterMovimientoFormGroup;

  private initialFormValue!: IFiltroMovimientoForm;

  constructor() {
    this.configForm();
    this.loadCombos();
  }

  protected filtrar(): void {
    this.tableList().filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    this.tableList().refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private configForm(): void {
    this.formData = this.formBuilder.group({
      ideProd: [-1, [], []],
      ideLote: ['', [], []],
      tipoMovi: ['', [], []],
      fechaDesde: ['', [], []],
      fechaHasta: ['', [], []],
      usuaIngre: ['', [], []],
    }) as FilterMovimientoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCombos(): void {
    this.movimientosService.listarComboProductos().subscribe((res) => {
      this.opcionesProductos = res ?? [];
    });

    this.movimientosService.listarComboTipos().subscribe((res) => {
      this.opcionesTipos = res ?? [];
    });
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.getRawValue();

    this.appendParam(params, 'ideProd', filtro.ideProd);
    this.appendParam(params, 'ideLote', filtro.ideLote);
    this.appendParam(params, 'tipoMovi', filtro.tipoMovi);
    this.appendParam(params, 'usuaIngre', filtro.usuaIngre);

    if (isValidStringValue(filtro.fechaDesde)) {
      params.append('fechaDesde', filtro.fechaDesde);
    }

    if (isValidStringValue(filtro.fechaHasta)) {
      params.append('fechaHasta', filtro.fechaHasta);
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

    if (stringValue !== '') {
      params.append(key, stringValue);
    }
  }
}
