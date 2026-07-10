import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { PerfilesService, RolesService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroPerfil } from 'app/models';
import { ListPerfilesConfig } from './list_perfiles.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
];

type FilterPerfilFormGroup = FormGroupOf<IFiltroPerfil>;

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

  private readonly _perfilesService = inject(PerfilesService);
  private readonly _rolesService = inject(RolesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListPerfilesConfig;

  protected opcionesRoles: IComboBoxOption[] = [];
  protected opcionesNombres: IComboBoxOption[] = [];
  protected opcionesDescripcion: IComboBoxOption[] = [];

  protected formData!: FilterPerfilFormGroup;

  private initialFormValue!: IFiltroPerfil;

  constructor() {
    this.configForm();
    this.loadComboRoles();
    this.loadComboNombres();
    this.loadComboDescripcion();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideRol: ['', [], []],
      nombrePerf: ['', [], []],
      descripcionPerf: ['', [], []],
    }) as FilterPerfilFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboRoles(): void {
    this._rolesService.listarComboRoles().subscribe((res) => {
      this.opcionesRoles = res ?? [];
    });
  }

  private loadComboNombres(): void {
    this._perfilesService.listarComboNombres().subscribe((res) => {
      this.opcionesNombres = res ?? [];
    });
  }

  private loadComboDescripcion(): void {
    this._perfilesService.listarComboDescripcion().subscribe((res) => {
      this.opcionesDescripcion = res ?? [];
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
    const filtro = this.formData.value as IFiltroPerfil;

    this.appendParam(params, 'ideRol', filtro.ideRol);
    this.appendParam(params, 'nombrePerf', filtro.nombrePerf);
    this.appendParam(params, 'descripcionPerf', filtro.descripcionPerf);

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
