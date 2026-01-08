import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroPedido } from 'app/models';
import { ListPedidoConfig } from './list_pedidos.config';
import { EmpresasService, PedidosService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
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
  UiDatetimePickerComponent
];

type filterPedidoFormGroup = FormGroupOf<IFiltroPedido>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListPedidoConfig;
  private readonly _empresasService = inject(EmpresasService);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected opcionesEmpresas!: IComboBoxOption[];
  protected opcionesEstadosPedi!: IComboBoxOption[];
  protected opcionesMotivosPedi!: IComboBoxOption[];
  protected formData!: filterPedidoFormGroup;
  private initialFormValue!: IFiltroPedido;

  private idEmpresa: number = -1;

  constructor() {
    this.loadEmpresas();
    this.loadComboEstados();
    this.loadComboMotivos();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreEmpr: ['', [], []],
      estadoPedi: ['', [], []],
      motivoPedi: ['', [], []],
      fechaPediDesde: ['', [], []],
      fechaPediHasta: ['', [], []]
    }) as filterPedidoFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEmpresas() {
    this._empresasService.listarComboEmpresas().subscribe(
      (res) => {
        this.opcionesEmpresas = res;
      }
    );
  }
  private loadComboEstados() {
    this._pedidosService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesEstadosPedi = res;
      }
    );
  }
  private loadComboMotivos() {
    this._pedidosService.listarComboMotivos().subscribe(
      (res) => {
        this.opcionesMotivosPedi = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroPedido;
    if (isValidStringValue(filtro.nombreEmpr)) params.append('nombreEmpr', filtro.nombreEmpr );
    if (isValidStringValue(filtro.estadoPedi)) params.append('estadoPedi', filtro.estadoPedi );
    if (isValidStringValue(filtro.motivoPedi)) params.append('motivoPedi', filtro.motivoPedi );
    if (isValidStringValue(filtro.fechaPediDesde)) params.append('fechaPediDesde', filtro.fechaPediDesde );
    if (isValidStringValue(filtro.fechaPediDesde)) params.append('fechaPediDesde', filtro.fechaPediDesde );
    return params;
  }

  

  protected refreshData(actionClick: string){
    if(actionClick === 'refresh'){
      const tableListInstance = this._tableList();
      tableListInstance.refreshData();
      this.resetForm();
    }
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}