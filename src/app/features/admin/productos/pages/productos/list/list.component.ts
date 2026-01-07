import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IEmpresaResult, IFiltroEmpresa } from 'app/models';
import { ListEmpresasConfig } from './list_empresas.config';
import { EmpresasService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule
];

type filterEmpresaFormGroup = FormGroupOf<IFiltroEmpresa>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListEmpresasConfig;
  private readonly _empresasService = inject(EmpresasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected estadosEmpresa!: IComboBoxOption[];
  protected formData!: filterEmpresaFormGroup;
  private initialFormValue!: IFiltroEmpresa;

  private idEmpresa: number = -1;

  constructor() {
    this.loadEstadosEmpresa();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreEmp: ['', [], []],
      estadoEmp: ['', [], []],
      responsableEmp: ['', [], []],
    }) as filterEmpresaFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEstadosEmpresa() {
    this._empresasService.listarEstados().subscribe(
      (res) => {
        this.estadosEmpresa = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEmpresa;
    if (isValidStringValue(filtro.nombreEmp)) params.append('nombreEmp', filtro.nombreEmp );
    if (isValidStringValue(filtro.estadoEmp)) params.append('estadoEmp', filtro.estadoEmp );
    if (isValidStringValue(filtro.responsableEmp)) params.append('responsableEmp', filtro.responsableEmp );
    return params;
  }

  protected redirectToEmpresaPrecios(clickAction: string) {
    if(clickAction === 'redirect') {
      if(this.idEmpresa > -1){
        this._router.navigate(['../precios', this.idEmpresa], {relativeTo: this._route});
      }
    }
  }

  protected setIdEmpresa(elem: any) {
    if(elem && elem.row){
      this.idEmpresa = elem.row.ide_empr;
    }else{
      this.idEmpresa = -1;
    }
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