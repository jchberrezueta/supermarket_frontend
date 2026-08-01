import { Component, inject, viewChild } from '@angular/core';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { FormGroupOf } from '@core/utils/utilities';

import { IFiltroOpciones } from '@models';

import { OpcionesService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiCardComponent } from '@shared/components/card/card.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

import { UiTableListComponent } from '@shared/components/index';

import { IComboBoxOption } from '@shared/models/combo_box_option';

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
  private readonly tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly opcionesService = inject(OpcionesService);

  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListOpcionesConfig;

  protected opcionesNombres: IComboBoxOption[] = [];

  protected opcionesRutas: IComboBoxOption[] = [];

  protected opcionesActividad: IComboBoxOption[] = [];

  protected opcionesNiveles: IComboBoxOption[] = [];

  protected opcionesPadres: IComboBoxOption[] = [];

  protected opcionesVisible: IComboBoxOption[] = [];

  protected formData!: FilterOpcionFormGroup;

  private initialFormValue!: IFiltroOpciones;

  constructor() {
    this.configForm();
    this.loadComboEstados();
    this.loadComboNombres();
    this.loadComboRutas();
    this.loadComboNiveles();
    this.loadComboPadres();
    this.loadComboVisible();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreOpci: [''],
      rutaOpci: [''],
      activoOpci: [''],
      nivelOpci: [''],
      padreOpci: [''],
      visibleOpci: [''],
    }) as FilterOpcionFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres(): void {
    this.opcionesService.listarComboNombres().subscribe({
      next: (response) => {
        this.opcionesNombres = response ?? [];
      },
    });
  }

  private loadComboRutas(): void {
    this.opcionesService.listarComboRutas().subscribe({
      next: (response) => {
        this.opcionesRutas = response ?? [];
      },
    });
  }

  private loadComboNiveles(): void {
    this.opcionesService.listarComboNiveles().subscribe({
      next: (response) => {
        this.opcionesNiveles = response ?? [];
      },
    });
  }

  private loadComboPadres(): void {
    this.opcionesService.listarComboPadres().subscribe({
      next: (response) => {
        this.opcionesPadres = response ?? [];
      },
    });
  }

  private loadComboEstados(): void {
    this.opcionesService.listarComboEstados().subscribe({
      next: (response) => {
        this.opcionesActividad = response ?? [];
      },
    });
  }

  private loadComboVisible(): void {
    this.opcionesService.listarComboVisible().subscribe({
      next: (response) => {
        this.opcionesVisible = response ?? [];
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

    const filtro = this.formData.getRawValue();

    this.appendParam(params, 'nombreOpci', filtro.nombreOpci);

    this.appendParam(params, 'rutaOpci', filtro.rutaOpci);

    this.appendParam(params, 'activoOpci', filtro.activoOpci);

    this.appendParam(params, 'nivelOpci', filtro.nivelOpci);

    this.appendParam(params, 'padreOpci', filtro.padreOpci);

    this.appendParam(params, 'visibleOpci', filtro.visibleOpci);

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
