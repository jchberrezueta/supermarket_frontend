import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroPedido } from 'app/models';
import { ListPedidoConfig } from './list_pedidos.config';
import { EmpresasService, PedidosService } from '@services/index';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiDatetimePickerComponent,
];

type FilterPedidoFormGroup = FormGroupOf<IFiltroPedido>;

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

  private readonly _empresasService = inject(EmpresasService);
  private readonly _pedidosService = inject(PedidosService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListPedidoConfig;

  protected opcionesEmpresas: IComboBoxOption[] = [];
  protected opcionesEstadosPedi: IComboBoxOption[] = [];
  protected opcionesMotivosPedi: IComboBoxOption[] = [];

  protected formData!: FilterPedidoFormGroup;

  private initialFormValue!: IFiltroPedido;

  constructor() {
    this.configForm();
    this.loadEmpresas();
    this.loadComboEstados();
    this.loadComboMotivos();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreEmpr: ['', [], []],
      estadoPedi: ['', [], []],
      motivoPedi: ['', [], []],
      fechaPediDesde: ['', [], []],
      fechaPediHasta: ['', [], []],
    }) as FilterPedidoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEmpresas(): void {
    this._empresasService.listarComboEmpresas().subscribe((res) => {
      this.opcionesEmpresas = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._pedidosService.listarComboEstados().subscribe((res) => {
      this.opcionesEstadosPedi = res ?? [];
    });
  }

  private loadComboMotivos(): void {
    this._pedidosService.listarComboMotivos().subscribe((res) => {
      this.opcionesMotivosPedi = res ?? [];
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
    const filtro = this.formData.value as IFiltroPedido;

    if (isValidStringValue(filtro.nombreEmpr)) {
      params.append('nombreEmpr', filtro.nombreEmpr);
    }

    if (isValidStringValue(filtro.estadoPedi)) {
      params.append('estadoPedi', filtro.estadoPedi);
    }

    if (isValidStringValue(filtro.motivoPedi)) {
      params.append('motivoPedi', filtro.motivoPedi);
    }

    if (isValidStringValue(filtro.fechaPediDesde)) {
      params.append('fechaPediDesde', filtro.fechaPediDesde);
    }

    if (isValidStringValue(filtro.fechaPediHasta)) {
      params.append('fechaPediHasta', filtro.fechaPediHasta);
    }

    return params;
  }
}
