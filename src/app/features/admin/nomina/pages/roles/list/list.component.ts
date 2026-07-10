import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { RolesService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroRol } from 'app/models';
import { ListRolesConfig } from './list_roles.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
];

type FilterRolFormGroup = FormGroupOf<IFiltroRol>;

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

  private readonly _rolesService = inject(RolesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListRolesConfig;

  protected opcionesNombres: IComboBoxOption[] = [];
  protected opcionesDescripcion: IComboBoxOption[] = [];

  protected formData!: FilterRolFormGroup;

  private initialFormValue!: IFiltroRol;

  constructor() {
    this.configForm();
    this.loadComboNombres();
    this.loadComboDescripcion();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreRol: ['', [], []],
      descripcionRol: ['', [], []],
    }) as FilterRolFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres(): void {
    this._rolesService.listarComboNombres().subscribe((res) => {
      this.opcionesNombres = res ?? [];
    });
  }

  private loadComboDescripcion(): void {
    this._rolesService.listarComboDescripcion().subscribe((res) => {
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
    const filtro = this.formData.value as IFiltroRol;

    this.appendParam(params, 'nombreRol', filtro.nombreRol);
    this.appendParam(params, 'descripcionRol', filtro.descripcionRol);

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
