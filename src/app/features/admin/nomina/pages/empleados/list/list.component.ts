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

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
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

  protected formData!: FilterEmpleadoFormGroup;

  private initialFormValue!: IFiltroEmpleado;

  constructor() {
    this.configForm();
    this.loadComboRoles();
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboApellidoPaterno();
    this.loadComboTitulos();
    this.loadComboEstados();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideRol: ['', [], []],
      cedulaEmpl: ['', [], []],
      primerNombreEmpl: ['', [], []],
      apellidoPaternoEmpl: ['', [], []],
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

  private loadComboCedulas(): void {
    this._empleadosService.listarComboCedulas().subscribe((res) => {
      this.opcionesEmplCedulas = res ?? [];
    });
  }

  private loadComboPrimerNombre(): void {
    this._empleadosService.listarComboPrimerNombre().subscribe((res) => {
      this.opcionesEmplPrimerNombre = res ?? [];
    });
  }

  private loadComboApellidoPaterno(): void {
    this._empleadosService.listarComboApellidoPaterno().subscribe((res) => {
      this.opcionesEmplApellidoPaterno = res ?? [];
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
    this.appendParam(params, 'cedulaEmpl', filtro.cedulaEmpl);
    this.appendParam(params, 'primerNombreEmpl', filtro.primerNombreEmpl);
    this.appendParam(params, 'apellidoPaternoEmpl', filtro.apellidoPaternoEmpl);
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
