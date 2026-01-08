import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroPerfil, IFiltroRol } from 'app/models';
import { ListPerfilesConfig } from './list_perfiles.config';
import { CategoriasService, PerfilesService, RolesService } from '@services/index';
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

type filterPerfilFormGroup = FormGroupOf<IFiltroPerfil>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListPerfilesConfig;
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _rolesService = inject(RolesService);
  private formBuilder= inject(FormBuilder);
  protected opcionesRoles!: IComboBoxOption[];
  protected opcionesNombres!: IComboBoxOption[];
  protected opcionesDescripcion!: IComboBoxOption[];
  protected formData!: filterPerfilFormGroup;
  private initialFormValue!: IFiltroPerfil;


  constructor() {
    this.loadComboRoles();
    this.loadComboNombres();
    this.loadComboDescripcion();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideRol: ['', [], []],
      nombrePerf: ['', [], []],
      descripcionPerf: ['', [], []],
    }) as filterPerfilFormGroup;
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
  private loadComboNombres() {
    this._perfilesService.listarComboNombres().subscribe(
      (res) => {
        this.opcionesNombres = res;
      }
    );
  }
  private loadComboDescripcion() {
    this._perfilesService.listarComboDescripcion().subscribe(
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
    const filtro = this.formData.value as IFiltroPerfil;
    if (isValidStringValue(filtro.ideRol+'')) params.append('ideRol', filtro.ideRol+'' );
    if (isValidStringValue(filtro.nombrePerf)) params.append('nombrePerf', filtro.nombrePerf );
    if (isValidStringValue(filtro.descripcionPerf)) params.append('descripcionPerf', filtro.descripcionPerf );
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