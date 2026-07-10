import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { OpcionesService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroOpciones } from 'app/models';
import { ListOpcionesConfig } from './list_opciones.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiInputBoxComponent,
];

type FilterOpcionFormGroup = FormGroupOf<IFiltroOpciones>;

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

  private readonly _opcionesService = inject(OpcionesService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListOpcionesConfig;

  protected opcionesNombres: IComboBoxOption[] = [];
  protected opcionesRutas: IComboBoxOption[] = [];
  protected opcionesActividad: IComboBoxOption[] = [];

  protected formData!: FilterOpcionFormGroup;

  private initialFormValue!: IFiltroOpciones;

  constructor() {
    this.configForm();
    this.loadComboEstados();
    this.loadComboNombres();
    this.loadComboRutas();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideOpci: [0, [], []],
      nombreOpci: ['', [], []],
      rutaOpci: ['', [], []],
      activoOpci: ['', [], []],
      nivelOpci: [0, [], []],
      padreOpci: [0, [], []],
      iconoOpci: ['', [], []],
    }) as FilterOpcionFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres(): void {
    this._opcionesService.listarComboNombres().subscribe((res) => {
      this.opcionesNombres = res ?? [];
    });
  }

  private loadComboRutas(): void {
    this._opcionesService.listarComboRutas().subscribe((res) => {
      this.opcionesRutas = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._opcionesService.listarComboEstados().subscribe((res) => {
      this.opcionesActividad = res ?? [];
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
    const filtro = this.formData.value as IFiltroOpciones;

    this.appendParam(params, 'nombreOpci', filtro.nombreOpci);
    this.appendParam(params, 'rutaOpci', filtro.rutaOpci);
    this.appendParam(params, 'activoOpci', filtro.activoOpci);

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
