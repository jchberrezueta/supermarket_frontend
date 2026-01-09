import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroLote } from 'app/models';
import { ListLotesConfig } from './list_lotes.config';
import { LotesService } from '@services/lotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent,
  UiDatetimePickerComponent
];

interface IFiltroLoteForm {
  ideProd: number;
  estadoLote: string;
  fechaCaducidadDesde: string;
  fechaCaducidadHasta: string;
}

type filterLoteFormGroup = FormGroupOf<IFiltroLoteForm>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListLotesConfig;
  private readonly _lotesService = inject(LotesService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  protected opcionesProductos!: IComboBoxOption[];
  protected opcionesEstados!: IComboBoxOption[];
  protected formData!: filterLoteFormGroup;
  private initialFormValue!: IFiltroLoteForm;

  constructor() {
    this.loadComboProductos();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideProd: [-1, [], []],
      estadoLote: ['', [], []],
      fechaCaducidadDesde: ['', [], []],
      fechaCaducidadHasta: ['', [], []]
    }) as filterLoteFormGroup;
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboProductos() {
    this._lotesService.listarComboProductos().subscribe(
      (res) => {
        this.opcionesProductos = res;
      }
    );
  }

  private loadComboEstados() {
    this._lotesService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesEstados = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroLoteForm;
    if (filtro.ideProd && filtro.ideProd > 0) params.append('ideProd', filtro.ideProd + '');
    if (isValidStringValue(filtro.estadoLote)) params.append('estadoLote', filtro.estadoLote);
    if (isValidStringValue(filtro.fechaCaducidadDesde)) params.append('fechaCaducidadLoteDesde', filtro.fechaCaducidadDesde);
    if (isValidStringValue(filtro.fechaCaducidadHasta)) params.append('fechaCaducidadLoteHasta', filtro.fechaCaducidadHasta);
    return params;
  }

  protected refreshData(actionClick: string) {
    if (actionClick === 'refresh') {
      const tableListInstance = this._tableList();
      tableListInstance.refreshData();
      this.resetForm();
    }
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}