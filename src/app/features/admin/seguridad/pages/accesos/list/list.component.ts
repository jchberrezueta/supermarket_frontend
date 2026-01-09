import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroAccesoUsuario, IFiltroRol } from 'app/models';
import { ListAccesosUsuarioConfig } from './list_accesos.config';
import { AccesosService, CategoriasService, CuentasService, RolesService } from '@services/index';
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
  UiDatetimePickerComponent
];

type filterAccesoUsuarioFormGroup = FormGroupOf<IFiltroAccesoUsuario>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListAccesosUsuarioConfig;
  private readonly _accesosService = inject(AccesosService);
  private readonly _cuentasService = inject(CuentasService);
  private formBuilder= inject(FormBuilder);
  protected opcionesCuentas!: IComboBoxOption[];
  protected opcionesIps!: IComboBoxOption[];
  protected opcionesNavegadores!: IComboBoxOption[];
  protected formData!: filterAccesoUsuarioFormGroup;
  private initialFormValue!: IFiltroAccesoUsuario;


  constructor() {
    this.loadComboCuentas();
    this.loadComboIps();
    this.loadComboNavegador();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideCuen: ['', [], []],
      ipAcce: ['', [], []],
      navegadorAcce: ['', [], []],
      fechaAcceDesde: ['', [], []],
      fechaAcceHasta: ['', [], []],
    }) as filterAccesoUsuarioFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCuentas() {
    this._cuentasService.listarComboCuentas().subscribe(
      (res) => {
        this.opcionesCuentas = res;
      }
    );
  }
  private loadComboIps() {
    this._accesosService.listarComboIps().subscribe(
      (res) => {
        this.opcionesIps = res;
      }
    );
  }
  private loadComboNavegador() {
    this._accesosService.listarComboNavegador().subscribe(
      (res) => {
        this.opcionesNavegadores = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroAccesoUsuario;
    if (isValidStringValue(filtro.ideCuen+'')) params.append('ideCuen', filtro.ideCuen+'' );
    if (isValidStringValue(filtro.ipAcce)) params.append('ipAcce', filtro.ipAcce );
    if (isValidStringValue(filtro.navegadorAcce)) params.append('navegadorAcce', encodeURIComponent(filtro.navegadorAcce) );
    if (isValidStringValue(filtro.fechaAcceDesde)) params.append('fechaAcceDesde', filtro.fechaAcceDesde );
    if (isValidStringValue(filtro.fechaAcceHasta)) params.append('fechaAcceHasta', filtro.fechaAcceHasta );
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