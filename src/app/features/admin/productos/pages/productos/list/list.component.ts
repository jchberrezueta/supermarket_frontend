import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroProducto } from 'app/models';
import { ListProductosConfig } from './list_productos.config';
import { CategoriasService, MarcasService, ProductosService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent
];

type filterProductoFormGroup = FormGroupOf<IFiltroProducto>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListProductosConfig;
  private readonly _categoriasService = inject(CategoriasService);
  private readonly _marcasService = inject(MarcasService);
  private readonly _productosService = inject(ProductosService);
  private formBuilder= inject(FormBuilder);
  protected opcionesCategorias!: IComboBoxOption[];
  protected opcionesMarcas!: IComboBoxOption[];
  protected opcionesProdNombres!: IComboBoxOption[];
  protected opcionesProdCodBarras!: IComboBoxOption[];
  protected opcionesProdEstados!: IComboBoxOption[];
  protected opcionesProdDisponibilidad!: IComboBoxOption[];
  protected formData!: filterProductoFormGroup;
  private initialFormValue!: IFiltroProducto;


  constructor() {
    this.loadCategorias();
    this.loadMarcas();
    this.loadProductos();
    this.loadProductosCodBarras();
    this.loadProductosEstados();
    this.loadProductosDisponiblidad();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideCate: ['', [], []],
      ideMarc: ['', [], []],
      nombreProd: ['', [], []],
      codigoBarraProd: ['', [], []],
      estadoProd: ['', [], []],
      disponibleProd: ['', [], []],
    }) as filterProductoFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCategorias() {
    this._categoriasService.listarComboCategorias().subscribe(
      (res) => {
        this.opcionesCategorias = res;
      }
    );
  }
  private loadMarcas() {
    this._marcasService.listarComboMarcas().subscribe(
      (res) => {
        this.opcionesMarcas = res;
      }
    );
  }
  private loadProductos() {
    this._productosService.listarComboProductos().subscribe(
      (res) => {
        this.opcionesProdNombres = res;
      }
    );
  }
  private loadProductosCodBarras() {
    this._productosService.listarComboCodigoBarras().subscribe(
      (res) => {
        this.opcionesProdCodBarras = res;
      }
    );
  }
  private loadProductosEstados() {
    this._productosService.listarComboEstados().subscribe(
      (res) => {
        this.opcionesProdEstados = res;
      }
    );
  }
  private loadProductosDisponiblidad() {
    this._productosService.listarComboDisponibilidad().subscribe(
      (res) => {
        this.opcionesProdDisponibilidad = res;
      }
    );
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroProducto;
    if (isValidStringValue(filtro.ideCate+'')) params.append('ideCate', filtro.ideCate+'');
    if (isValidStringValue(filtro.ideMarc+'')) params.append('ideMarc', filtro.ideMarc+'');
    if (isValidStringValue(filtro.nombreProd)) params.append('nombreProd', filtro.nombreProd );
    if (isValidStringValue(filtro.codigoBarraProd)) params.append('codigoBarraProd', filtro.codigoBarraProd );
    if (isValidStringValue(filtro.estadoProd)) params.append('estadoProd', filtro.estadoProd );
    if (isValidStringValue(filtro.disponibleProd)) params.append('disponibleProd', filtro.disponibleProd );
    console.log(params)
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