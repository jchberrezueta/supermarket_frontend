import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import {
  CuentasService,
  EmpleadosService,
  PerfilesService,
} from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroCuenta } from 'app/models';
import { ListCuentasConfig } from './list_cuentas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
];

type FilterCuentaFormGroup = FormGroupOf<IFiltroCuenta>;

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

  private readonly _cuentasService = inject(CuentasService);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _perfilesService = inject(PerfilesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListCuentasConfig;

  protected opcionesEmpleados: IComboBoxOption[] = [];
  protected opcionesPerfiles: IComboBoxOption[] = [];
  protected opcionesCuenUsuarios: IComboBoxOption[] = [];
  protected opcionesCuenEstados: IComboBoxOption[] = [];

  protected formData!: FilterCuentaFormGroup;

  private initialFormValue!: IFiltroCuenta;

  constructor() {
    this.configForm();
    this.loadComboEmpleados();
    this.loadComboPerfiles();
    this.loadComboUsuarios();
    this.loadComboEstados();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideEmpl: ['', [], []],
      idePerf: ['', [], []],
      usuarioCuen: ['', [], []],
      estadoCuen: ['', [], []],
    }) as FilterCuentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboEmpleados(): void {
    this._empleadosService.listarComboEmpleados().subscribe((res) => {
      this.opcionesEmpleados = res ?? [];
    });
  }

  private loadComboPerfiles(): void {
    this._perfilesService.listarComboPerfiles().subscribe((res) => {
      this.opcionesPerfiles = res ?? [];
    });
  }

  private loadComboUsuarios(): void {
    this._cuentasService.listarComboUsuarios().subscribe((res) => {
      this.opcionesCuenUsuarios = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._cuentasService.listarComboEstados().subscribe((res) => {
      this.opcionesCuenEstados = res ?? [];
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
    const filtro = this.formData.value as IFiltroCuenta;

    this.appendParam(params, 'ideEmpl', filtro.ideEmpl);
    this.appendParam(params, 'idePerf', filtro.idePerf);
    this.appendParam(params, 'usuarioCuen', filtro.usuarioCuen);
    this.appendParam(params, 'estadoCuen', filtro.estadoCuen);

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
