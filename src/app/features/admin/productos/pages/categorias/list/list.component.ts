import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { CategoriasService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroCategoria } from 'app/models';
import { ListConfig } from './list_empresas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
];

type FilterCategoriaFormGroup = FormGroupOf<IFiltroCategoria>;

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

  private readonly _categoriasService = inject(CategoriasService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListConfig;

  protected opcionesNombres: IComboBoxOption[] = [];
  protected opcionesDescripcion: IComboBoxOption[] = [];

  protected formData!: FilterCategoriaFormGroup;

  private initialFormValue!: IFiltroCategoria;

  constructor() {
    this.configForm();
    this.loadComboNombres();
    this.loadComboDescripcion();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreCate: ['', [], []],
      descripcionCate: ['', [], []],
    }) as FilterCategoriaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres(): void {
    this._categoriasService.listarComboNombres().subscribe((res) => {
      this.opcionesNombres = res ?? [];
    });
  }

  private loadComboDescripcion(): void {
    this._categoriasService.listarComboDescripcion().subscribe((res) => {
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
    const filtro = this.formData.value as IFiltroCategoria;

    this.appendParam(params, 'nombreCate', filtro.nombreCate);
    this.appendParam(params, 'descripcionCate', filtro.descripcionCate);

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
