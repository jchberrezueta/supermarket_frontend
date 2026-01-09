import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroCliente } from 'app/models';
import { ListClientesConfig } from './list_clientes.config';
import { ClientesService } from '@services/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiInputBoxComponent } from "@shared/components/input-box/input-box.component";

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiInputBoxComponent
];


type filterClienteFormGroup = FormGroupOf<IFiltroCliente>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListClientesConfig;
  private readonly _clientesService = inject(ClientesService);
  private formBuilder = inject(FormBuilder);
  protected opcionesCedulas!: IComboBoxOption[];
  protected opcionesNombre!: IComboBoxOption[];
  protected opcionesApellido!: IComboBoxOption[];
  protected opcionesSocio!: IComboBoxOption[];
  protected opcionesTerceraEdad!: IComboBoxOption[];
  
  protected formData!: filterClienteFormGroup;
  private initialFormValue!: IFiltroCliente;

  constructor() {
    this.loadComboApellidoPaterno();
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboSocio();
    this.loadComboTerceraEdad();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      cedulaClie: ['', [], []],
      primerNombreClie: ['', [], []],
      apellidoPaternoClie: ['', [], []],
      esSocio: ['', [], []],
      esTerceraEdad: ['', [], []]
    }) as filterClienteFormGroup;
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCedulas() {
    this._clientesService.listarComboCedulas().subscribe(
      (res) => {
        this.opcionesCedulas = res;
      }
    );
  }
  private loadComboPrimerNombre() {
    this._clientesService.listarComboNombres().subscribe(
      (res) => {
        this.opcionesNombre = res;
      }
    );
  }
  private loadComboApellidoPaterno() {
    this._clientesService.listarComboApellidos().subscribe(
      (res) => {
        this.opcionesApellido = res;
      }
    );
  }
  private loadComboSocio() {
    this._clientesService.listarComboSocio().subscribe(
      (res) => {
        this.opcionesSocio = res;
      }
    );
  }
  private loadComboTerceraEdad() {
    this._clientesService.listarComboTerceraEdad().subscribe(
      (res) => {
        this.opcionesTerceraEdad = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroCliente;
    if (isValidStringValue(filtro.cedulaClie)) params.append('cedulaClie', filtro.cedulaClie);
    if (isValidStringValue(filtro.primerNombreClie)) params.append('primerNombreClie', filtro.primerNombreClie);
    if (isValidStringValue(filtro.apellidoPaternoClie)) params.append('apellidoPaternoClie', filtro.apellidoPaternoClie);
    if (isValidStringValue(filtro.esSocio)) params.append('esSocio', filtro.esSocio);
    if (isValidStringValue(filtro.esTerceraEdad)) params.append('esTerceraEdad', filtro.esTerceraEdad);
    return params;
  }

  protected limpiar() {
    this.resetForm();
    this._tableList().refreshData();
  }

  protected refreshData(event: any) {
    this._tableList().refreshData();
    this.resetForm();
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}
