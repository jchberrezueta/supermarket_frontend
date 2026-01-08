import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroCategoria, IFiltroEmpleado, IFiltroEmpresa } from 'app/models';
import { ListEmpleadosConfig } from './list_empleados.config';
import { CategoriasService, EmpleadosService, RolesService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent
];

type filterEmpleadoFormGroup = FormGroupOf<IFiltroEmpleado>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListEmpleadosConfig;
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _rolesService = inject(RolesService);
  private formBuilder= inject(FormBuilder);
  protected opcionesRoles!: IComboBoxOption[];
  protected opcionesEmplCedulas!: IComboBoxOption[];
  protected opcionesEmplPrimerNombre!: IComboBoxOption[];
  protected opcionesEmplApellidoPaterno!: IComboBoxOption[];
  protected opcionesEmplTitulos!: IComboBoxOption[];
  protected opcionesEmplEstados!: IComboBoxOption[];
  protected formData!: filterEmpleadoFormGroup;
  private initialFormValue!: IFiltroEmpleado;


  constructor() {
    this.loadComboRoles();
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboApellidoPaterno();
    this.loadComboTitulos();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideRol: ['', [], []],
      cedulaEmpl: ['', [], []],
      primerNombreEmpl: ['', [], []],
      apellidoPaternoEmpl: ['', [], []],
      tituloEmpl: ['', [], []],
      estadoEmpl: ['', [], []],
    }) as filterEmpleadoFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboRoles() {
    this._rolesService.listarComboRoles().subscribe(
      (res) => {
        this.opcionesRoles = res;
      }
    );
  }
  private loadComboCedulas() {
    this._empleadosService.listarComboCedulas().subscribe(
      (res) => {
        this.opcionesEmplCedulas = res;
      }
    );
  }
  private loadComboPrimerNombre() {
    this._empleadosService.listarComboPrimerNombre().subscribe(
      (res) => {
        this.opcionesEmplPrimerNombre = res;
      }
    );
  }
  private loadComboApellidoPaterno() {
    this._empleadosService.listarComboApellidoPaterno().subscribe(
      (res) => {
        this.opcionesEmplApellidoPaterno = res;
      }
    );
  }
  private loadComboTitulos() {
    this._empleadosService.listarComboTitulos().subscribe(
      (res) => {
        this.opcionesEmplTitulos = res;
      }
    );
  }
  private loadComboEstados() {
    this._empleadosService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesEmplEstados = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
   
    const filtro = this.formData.value as IFiltroEmpleado;
     console.log(filtro);
    if (isValidStringValue(filtro.ideRol+'')) params.append('ideRol', filtro.ideRol+'' );
    if (isValidStringValue(filtro.cedulaEmpl)) params.append('cedulaEmpl', filtro.cedulaEmpl );
    if (isValidStringValue(filtro.primerNombreEmpl)) params.append('primerNombreEmpl', filtro.primerNombreEmpl );
    if (isValidStringValue(filtro.apellidoPaternoEmpl)) params.append('apellidoPaternoEmpl', filtro.apellidoPaternoEmpl );
    if (isValidStringValue(filtro.tituloEmpl)) params.append('tituloEmpl', filtro.tituloEmpl );
    if (isValidStringValue(filtro.estadoEmpl)) params.append('estadoEmpl', filtro.estadoEmpl );
    console.log(params);
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