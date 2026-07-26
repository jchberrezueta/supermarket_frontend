import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { EmpleadosService, RolesService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroEmpleado } from 'app/models';
import { ListEmpleadosConfig } from './list_empleados.config';
import { UiComboBoxComponent } from '../../../../../../shared/components/combo-box/combo-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
];

type FilterEmpleadoFormGroup = FormGroupOf<IFiltroEmpleado>;

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

  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _rolesService = inject(RolesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListEmpleadosConfig;

  protected opcionesRoles: IComboBoxOption[] = [];
  protected opcionesEmplCedulas: IComboBoxOption[] = [];
  protected opcionesEmplPrimerNombre: IComboBoxOption[] = [];
  protected opcionesEmplApellidoPaterno: IComboBoxOption[] = [];
  protected opcionesEmplTitulos: IComboBoxOption[] = [];
  protected opcionesEmplEstados: IComboBoxOption[] = [];
  protected opcionesEmpleados: IComboBoxOption[] = [];

  protected formData!: FilterEmpleadoFormGroup;

  private initialFormValue!: IFiltroEmpleado;

  constructor() {
    this.configForm();
    this.loadComboRoles();
    this.loadComboCedulas();
    this.loadComboEmpleados();
    this.loadComboTitulos();
    this.loadComboEstados();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideRol: ['', [], []],
      nombreRol: ['', [], []],
      cedulaEmpl: ['', [], []],
      nombreCompletoEmpl: ['', [], []],
      tituloEmpl: ['', [], []],
      estadoEmpl: ['', [], []],
    }) as FilterEmpleadoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboRoles(): void {
    this._rolesService.listarComboRoles().subscribe((res) => {
      this.opcionesRoles = res ?? [];
    });
  }

  private loadComboEmpleados(): void {
    this._empleadosService.listarComboEmpleados().subscribe((res) => {
      this.opcionesEmpleados = res ?? [];
    });
  }

  private loadComboCedulas(): void {
    this._empleadosService.listarComboCedulas().subscribe((res) => {
      this.opcionesEmplCedulas = res ?? [];
    });
  }

  private loadComboTitulos(): void {
    this._empleadosService.listarComboTitulos().subscribe((res) => {
      this.opcionesEmplTitulos = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._empleadosService.listarComboEstados().subscribe((res) => {
      this.opcionesEmplEstados = res ?? [];
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
    const filtro = this.formData.value as IFiltroEmpleado;
    this.appendParam(params, 'ideRol', filtro.ideRol);
    this.appendParam(params, 'nombreRol', filtro.nombreRol);
    this.appendParam(params, 'cedulaEmpl', filtro.cedulaEmpl);
    this.appendParam(params, 'nombreCompletoEmpl', filtro.nombreCompletoEmpl);
    this.appendParam(params, 'tituloEmpl', filtro.tituloEmpl);
    this.appendParam(params, 'estadoEmpl', filtro.estadoEmpl);

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
