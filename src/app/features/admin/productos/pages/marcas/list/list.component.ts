import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroCategoria, IFiltroEmpresa, IFiltroMarca } from 'app/models';
import { ListConfig } from './list_empresas.config';
import { CategoriasService, MarcasService } from '@services/index';
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

type filterMarcaFormGroup = FormGroupOf<IFiltroMarca>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListConfig;
  private readonly _marcasService = inject(MarcasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected opcionesNombres!: IComboBoxOption[];
  protected opcionesPais!: IComboBoxOption[];
  protected opcionesCalidad!: IComboBoxOption[];
  protected formData!: filterMarcaFormGroup;
  private initialFormValue!: IFiltroMarca;


  constructor() {
    this.loadComboNombres();
    this.loadComboPais();
    this.loadComboCalidad();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      nombreMarc: ['', [], []],
      paisOrigenMarc: ['', [], []],
      calidadMarc: [-1, [], []],
    }) as filterMarcaFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboNombres() {
    this._marcasService.listarComboNombres().subscribe(
      (res) => {
        this.opcionesNombres = res;
      }
    );
  }
  private loadComboPais() {
    this._marcasService.listarComboPais().subscribe(
      (res) => {
        this.opcionesPais = res;
      }
    );
  }
  private loadComboCalidad() {
    this._marcasService.listarComboCalidad().subscribe(
      (res) => {
        this.opcionesCalidad = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroMarca;
    if (isValidStringValue(filtro.nombreMarc)) params.append('nombreMarc', filtro.nombreMarc );
    if (isValidStringValue(filtro.paisOrigenMarc)) params.append('paisOrigenMarc', filtro.paisOrigenMarc );
    if (isValidStringValue(filtro.calidadMarc+'')) params.append('calidadMarc', filtro.calidadMarc+'' );
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