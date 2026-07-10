import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { ClientesService } from '@services/clientes.service';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroCliente } from 'app/models';
import { ListClientesConfig } from './list_clientes.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiInputBoxComponent,
];

type FilterClienteFormGroup = FormGroupOf<IFiltroCliente>;

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

  private readonly _clientesService = inject(ClientesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListClientesConfig;

  protected opcionesCedulas: IComboBoxOption[] = [];
  protected opcionesNombre: IComboBoxOption[] = [];
  protected opcionesApellido: IComboBoxOption[] = [];
  protected opcionesSocio: IComboBoxOption[] = [];
  protected opcionesTerceraEdad: IComboBoxOption[] = [];

  protected formData!: FilterClienteFormGroup;

  private initialFormValue!: IFiltroCliente;

  constructor() {
    this.configForm();
    this.loadComboApellidoPaterno();
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboSocio();
    this.loadComboTerceraEdad();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      cedulaClie: ['', [], []],
      primerNombreClie: ['', [], []],
      apellidoPaternoClie: ['', [], []],
      esSocio: ['', [], []],
      esTerceraEdad: ['', [], []],
    }) as FilterClienteFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCedulas(): void {
    this._clientesService.listarComboCedulas().subscribe((res) => {
      this.opcionesCedulas = res ?? [];
    });
  }

  private loadComboPrimerNombre(): void {
    this._clientesService.listarComboNombres().subscribe((res) => {
      this.opcionesNombre = res ?? [];
    });
  }

  private loadComboApellidoPaterno(): void {
    this._clientesService.listarComboApellidos().subscribe((res) => {
      this.opcionesApellido = res ?? [];
    });
  }

  private loadComboSocio(): void {
    this._clientesService.listarComboSocio().subscribe((res) => {
      this.opcionesSocio = res ?? [];
    });
  }

  private loadComboTerceraEdad(): void {
    this._clientesService.listarComboTerceraEdad().subscribe((res) => {
      this.opcionesTerceraEdad = res ?? [];
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
    const filtro = this.formData.value as IFiltroCliente;

    this.appendParam(params, 'cedulaClie', filtro.cedulaClie);
    this.appendParam(params, 'primerNombreClie', filtro.primerNombreClie);
    this.appendParam(params, 'apellidoPaternoClie', filtro.apellidoPaternoClie);
    this.appendParam(params, 'esSocio', filtro.esSocio);
    this.appendParam(params, 'esTerceraEdad', filtro.esTerceraEdad);

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
