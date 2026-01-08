import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroCuenta, IFiltroRol } from 'app/models';
import { ListCuentasConfig } from './list_cuentas.config';
import { CategoriasService, CuentasService, EmpleadosService, PerfilesService, RolesService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiComboBoxComponent
];

type filterCuentaFormGroup = FormGroupOf<IFiltroCuenta>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListCuentasConfig;
  private readonly _cuentasService = inject(CuentasService);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _perfilesService = inject(PerfilesService);
  private formBuilder= inject(FormBuilder);
  protected opcionesEmpleados!: IComboBoxOption[];
  protected opcionesPerfiles!: IComboBoxOption[];
  protected opcionesCuenUsuarios!: IComboBoxOption[];
  protected opcionesCuenEstados!: IComboBoxOption[];
  protected formData!: filterCuentaFormGroup;
  private initialFormValue!: IFiltroCuenta;


  constructor() {
    this.loadComboEmpleados();
    this.loadComboPerfiles();
    this.loadComboUsuarios();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideEmpl: ['', [], []],
      idePerf: ['', [], []],
      usuarioCuen: ['', [], []],
      estadoCuen: ['', [], []],
    }) as filterCuentaFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboEmpleados() {
    this._empleadosService.listarComboEmpleados().subscribe(
      (res) => {
        this.opcionesEmpleados = res;
      }
    );
  }
   private loadComboPerfiles() {
    this._perfilesService.listarComboPerfiles().subscribe(
      (res) => {
        this.opcionesPerfiles = res;
      }
    );
  }
  private loadComboUsuarios() {
    this._cuentasService.listarComboUsuarios().subscribe(
      (res) => {
        this.opcionesCuenUsuarios = res;
      }
    );
  }
  private loadComboEstados() {
    this._cuentasService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesCuenEstados = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroCuenta;
    if (isValidStringValue(filtro.ideEmpl+'')) params.append('ideEmpl', filtro.ideEmpl+'' );
    if (isValidStringValue(filtro.idePerf+'')) params.append('idePerf', filtro.idePerf+'' );
    if (isValidStringValue(filtro.usuarioCuen)) params.append('usuarioCuen', filtro.usuarioCuen );
    if (isValidStringValue(filtro.estadoCuen)) params.append('estadoCuen', filtro.estadoCuen );
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