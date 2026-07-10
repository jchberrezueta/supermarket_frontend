import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { AccesosService, CuentasService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroAccesoUsuario } from 'app/models';
import { ListAccesosUsuarioConfig } from './list_accesos.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiDatetimePickerComponent,
];

type FilterAccesoUsuarioFormGroup = FormGroupOf<IFiltroAccesoUsuario>;

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

  private readonly _accesosService = inject(AccesosService);
  private readonly _cuentasService = inject(CuentasService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListAccesosUsuarioConfig;

  protected opcionesCuentas: IComboBoxOption[] = [];
  protected opcionesIps: IComboBoxOption[] = [];
  protected opcionesNavegadores: IComboBoxOption[] = [];

  protected formData!: FilterAccesoUsuarioFormGroup;

  private initialFormValue!: IFiltroAccesoUsuario;

  constructor() {
    this.configForm();
    this.loadComboCuentas();
    this.loadComboIps();
    this.loadComboNavegador();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideCuen: ['', [], []],
      ipAcce: ['', [], []],
      navegadorAcce: ['', [], []],
      fechaAcceDesde: ['', [], []],
      fechaAcceHasta: ['', [], []],
    }) as FilterAccesoUsuarioFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCuentas(): void {
    this._cuentasService.listarComboCuentas().subscribe((res) => {
      this.opcionesCuentas = res ?? [];
    });
  }

  private loadComboIps(): void {
    this._accesosService.listarComboIps().subscribe((res) => {
      this.opcionesIps = res ?? [];
    });
  }

  private loadComboNavegador(): void {
    this._accesosService.listarComboNavegador().subscribe((res) => {
      this.opcionesNavegadores = res ?? [];
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
    const filtro = this.formData.value as IFiltroAccesoUsuario;

    this.appendParam(params, 'ideCuen', filtro.ideCuen);
    this.appendParam(params, 'ipAcce', filtro.ipAcce);
    this.appendParam(params, 'navegadorAcce', filtro.navegadorAcce);
    this.appendParam(params, 'fechaAcceDesde', filtro.fechaAcceDesde);
    this.appendParam(params, 'fechaAcceHasta', filtro.fechaAcceHasta);

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
