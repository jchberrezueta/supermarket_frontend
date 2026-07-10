import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { MarcasService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroMarca } from 'app/models';
import { ListConfig } from './list_marcas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
];

type FilterMarcaFormGroup = FormGroupOf<IFiltroMarca>;

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

  private readonly _marcasService = inject(MarcasService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListConfig;

  protected opcionesNombres: IComboBoxOption[] = [];
  protected opcionesPais: IComboBoxOption[] = [];
  protected opcionesCalidad: IComboBoxOption[] = [];

  protected formData!: FilterMarcaFormGroup;

  private initialFormValue!: IFiltroMarca;

  constructor() {
    this.configForm();
    this.loadComboNombres();
    this.loadComboPais();
    this.loadComboCalidad();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreMarc: ['', [], []],
      paisOrigenMarc: ['', [], []],
      calidadMarc: ['', [], []],
    }) as FilterMarcaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres(): void {
    this._marcasService.listarComboNombres().subscribe((res) => {
      this.opcionesNombres = res ?? [];
    });
  }

  private loadComboPais(): void {
    this._marcasService.listarComboPais().subscribe((res) => {
      this.opcionesPais = res ?? [];
    });
  }

  private loadComboCalidad(): void {
    this._marcasService.listarComboCalidad().subscribe((res) => {
      this.opcionesCalidad = res ?? [];
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
    const filtro = this.formData.value as IFiltroMarca;

    this.appendParam(params, 'nombreMarc', filtro.nombreMarc);
    this.appendParam(params, 'paisOrigenMarc', filtro.paisOrigenMarc);
    this.appendParam(params, 'calidadMarc', filtro.calidadMarc);

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
