import { Component, inject, viewChild } from '@angular/core';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { FormGroupOf } from '@core/utils/utilities';

import { IFiltroAccesoUsuario, ListResultadosAcceso } from '@models';

import { AccesosService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiCardComponent } from '@shared/components/card/card.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

import { UiTableListComponent } from '@shared/components/index';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { ListAccesosUsuarioConfig } from './list_accesos.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
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
  private readonly tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly accesosService = inject(AccesosService);

  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListAccesosUsuarioConfig;

  protected readonly resultados = ListResultadosAcceso;

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
      ideCuen: [''],

      usuarioCuen: [''],

      ipAcce: [''],

      navegadorAcce: [''],

      resultadoAcce: [''],

      fechaAcceDesde: [''],

      fechaAcceHasta: [''],
    }) as FilterAccesoUsuarioFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCuentas(): void {
    this.accesosService.listarComboCuentas().subscribe({
      next: (response) => {
        this.opcionesCuentas = response ?? [];
      },
    });
  }

  private loadComboIps(): void {
    this.accesosService.listarComboIps().subscribe({
      next: (response) => {
        this.opcionesIps = response ?? [];
      },
    });
  }

  private loadComboNavegador(): void {
    this.accesosService.listarComboNavegador().subscribe({
      next: (response) => {
        this.opcionesNavegadores = response ?? [];
      },
    });
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

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();

    const filter = this.formData.getRawValue();

    this.appendParam(params, 'usuarioCuen', filter.usuarioCuen);

    this.appendParam(params, 'ipAcce', filter.ipAcce);

    this.appendParam(params, 'navegadorAcce', filter.navegadorAcce);

    this.appendParam(params, 'resultadoAcce', filter.resultadoAcce);

    this.appendParam(params, 'fechaAcceDesde', filter.fechaAcceDesde);

    const fechaHasta = filter.fechaAcceHasta
      ? filter.fechaAcceHasta.replace(/T\d{2}:\d{2}(:\d{2})?/, 'T23:59:59')
      : '';

    this.appendParam(params, 'fechaAcceHasta', fechaHasta);

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

    if (!stringValue) {
      return;
    }

    params.append(key, stringValue);
  }
}
