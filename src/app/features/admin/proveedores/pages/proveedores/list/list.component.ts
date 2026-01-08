import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IEmpresaResult, IFiltroEmpresa, IFiltroProveedor } from 'app/models';
import { ListProveedoresConfig } from './list_proveedores.config';
import { EmpresasService, ProveedoresService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from "@shared/components/input-box/input-box.component";

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiInputBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule
];

type filterProveedorFormGroup = FormGroupOf<IFiltroProveedor>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListProveedoresConfig;
  private readonly _proveedoresService = inject(ProveedoresService);
  private formBuilder= inject(FormBuilder);
  protected opcionesCedula!: IComboBoxOption[];
  protected opcionesPrimerNombre!: IComboBoxOption[];
  protected opcionesApellidoPaterno!: IComboBoxOption[];
  protected opcionesEmail!: IComboBoxOption[];
  protected formData!: filterProveedorFormGroup;
  private initialFormValue!: IFiltroProveedor;

  constructor() {
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboApellidoPaterno();
    this.loadComboEmail();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideEmpr: ['', [], []],
      cedulaProv: ['', [], []],
      primerNombreProv: ['', [], []],
      apellidoPaternoProv: ['', [], []],
      emailProv: ['', [], []],
    }) as filterProveedorFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCedulas() {
    this._proveedoresService.listarComboCedula().subscribe(
      (res) => {
        this.opcionesCedula = res;
      }
    );
  }
  private loadComboPrimerNombre() {
    this._proveedoresService.listarComboPrimerNombre().subscribe(
      (res) => {
        this.opcionesPrimerNombre = res;
      }
    );
  }
  private loadComboApellidoPaterno() {
    this._proveedoresService.listarComboApellidoPaterno().subscribe(
      (res) => {
        this.opcionesApellidoPaterno = res;
      }
    );
  }
  private loadComboEmail() {
    this._proveedoresService.listarComboEmail().subscribe(
      (res) => {
        this.opcionesEmail = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroProveedor;
    if (isValidStringValue(filtro.ideEmpr)) params.append('ideEmpr', filtro.ideEmpr );
    if (isValidStringValue(filtro.cedulaProv)) params.append('cedulaProv', filtro.cedulaProv );
    if (isValidStringValue(filtro.primerNombreProv)) params.append('primerNombreProv', filtro.primerNombreProv );
    if (isValidStringValue(filtro.apellidoPaternoProv)) params.append('apellidoPaternoProv', filtro.apellidoPaternoProv );
    if (isValidStringValue(filtro.emailProv)) params.append('emailProv', filtro.emailProv );

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