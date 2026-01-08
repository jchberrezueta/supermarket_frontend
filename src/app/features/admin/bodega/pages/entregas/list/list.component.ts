import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroEmpresa, IFiltroEntrega } from 'app/models';
import { ListEntregasConfig } from './list_entregas.config';
import { EmpresasService, EntregasService, ProveedoresService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiDatetimePickerComponent
];

type filterEntregaFormGroup = FormGroupOf<IFiltroEntrega>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListEntregasConfig;
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _entregasService = inject(EntregasService);
  private formBuilder= inject(FormBuilder);
  protected opcionesProveedores!: IComboBoxOption[];
  protected opcionesProvEstados!: IComboBoxOption[];
  protected formData!: filterEntregaFormGroup;
  private initialFormValue!: IFiltroEntrega;


  constructor() {
    this.loadComboProveedores();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      idePedi: ['', [], []],
      ideProv: ['', [], []],
      estadoEntr: ['', [], []],
      fechaEntrDesde: ['', [], []],
      fechaEntrHasta: ['', [], []],
    }) as filterEntregaFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboProveedores() {
    this._proveedoresService.listarComboProveedores().subscribe(
      (res) => {
        this.opcionesProveedores = res;
      }
    );
  }
  private loadComboEstados() {
    this._entregasService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesProvEstados = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEntrega;
    if (isValidStringValue(filtro.idePedi)) params.append('idePedi', filtro.idePedi );
    if (isValidStringValue(filtro.ideProv)) params.append('ideProv', filtro.ideProv );
    if (isValidStringValue(filtro.estadoEntr)) params.append('estadoEntr', filtro.estadoEntr );
    if (isValidStringValue(filtro.fechaEntrDesde)) params.append('fechaEntrDesde', filtro.fechaEntrDesde );
    if (isValidStringValue(filtro.fechaEntrHasta)) params.append('fechaEntrHasta', filtro.fechaEntrHasta );
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