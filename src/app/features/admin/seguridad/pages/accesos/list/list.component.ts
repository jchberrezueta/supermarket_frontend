import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroRol } from 'app/models';
import { ListAccesosUsuarioConfig } from './list_accesos.config';
import { CategoriasService, RolesService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
];

type filterRolFormGroup = FormGroupOf<IFiltroRol>;

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
  private readonly _rolesService = inject(RolesService);
  private formBuilder= inject(FormBuilder);
  protected opcionesNombres!: IComboBoxOption[];
  protected opcionesDescripcion!: IComboBoxOption[];
  protected formData!: filterRolFormGroup;
  private initialFormValue!: IFiltroRol;


  constructor() {
    this.loadComboNombres();
    this.loadComboDescripcion();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreRol: ['', [], []],
      descripcionRol: ['', [], []],
    }) as filterRolFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres() {
    this._rolesService.listarComboNombres().subscribe(
      (res) => {
        this.opcionesNombres = res;
      }
    );
  }
  private loadComboDescripcion() {
    this._rolesService.listarComboDescripcion().subscribe(
      (res) => {
        this.opcionesDescripcion = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroRol;
    if (isValidStringValue(filtro.nombreRol)) params.append('nombreRol', filtro.nombreRol );
    if (isValidStringValue(filtro.descripcionRol)) params.append('descripcionRol', filtro.descripcionRol );
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