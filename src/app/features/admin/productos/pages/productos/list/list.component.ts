import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { FormGroupOf } from '@core/utils/utilities';
import { IFiltroProducto } from 'app/models';
import { ListProductosConfig } from './list_productos.config';
import {
  CategoriasService,
  MarcasService,
  ProductosService,
} from '@services/index';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
];

type FilterProductoFormGroup = FormGroupOf<IFiltroProducto>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  private readonly _tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly _categoriasService = inject(CategoriasService);
  private readonly _marcasService = inject(MarcasService);
  private readonly _productosService = inject(ProductosService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListProductosConfig;

  protected opcionesCategorias: IComboBoxOption[] = [];
  protected opcionesMarcas: IComboBoxOption[] = [];
  protected opcionesProdNombres: IComboBoxOption[] = [];
  protected opcionesProdCodBarras: IComboBoxOption[] = [];
  protected opcionesProdEstados: IComboBoxOption[] = [];
  protected opcionesProdDisponibilidad: IComboBoxOption[] = [];

  protected formData!: FilterProductoFormGroup;

  private initialFormValue!: IFiltroProducto;

  constructor() {
    this.configForm();
    this.loadCategorias();
    this.loadMarcas();
    this.loadProductos();
    this.loadProductosCodBarras();
    this.loadProductosEstados();
    this.loadProductosDisponibilidad();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideCate: ['', [], []],
      ideMarc: ['', [], []],
      nombreProd: ['', [], []],
      codigoBarraProd: ['', [], []],
      estadoProd: ['', [], []],
      disponibleProd: ['', [], []],
    }) as FilterProductoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCategorias(): void {
    this._categoriasService.listarComboCategorias().subscribe((res) => {
      this.opcionesCategorias = res ?? [];
    });
  }

  private loadMarcas(): void {
    this._marcasService.listarComboMarcas().subscribe((res) => {
      this.opcionesMarcas = res ?? [];
    });
  }

  private loadProductos(): void {
    this._productosService.listarComboProductos().subscribe((res) => {
      this.opcionesProdNombres = res ?? [];
    });
  }

  private loadProductosCodBarras(): void {
    this._productosService.listarComboCodigoBarras().subscribe((res) => {
      this.opcionesProdCodBarras = res ?? [];
    });
  }

  private loadProductosEstados(): void {
    this._productosService.listarComboEstados().subscribe((res) => {
      this.opcionesProdEstados = res ?? [];
    });
  }

  private loadProductosDisponibilidad(): void {
    this._productosService.listarComboDisponibilidad().subscribe((res) => {
      this.opcionesProdDisponibilidad = res ?? [];
    });
  }

  protected filtrar(): void {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    const tableListInstance = this._tableList();
    tableListInstance.refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroProducto;

    this.appendParam(params, 'ideCate', filtro.ideCate);
    this.appendParam(params, 'ideMarc', filtro.ideMarc);
    this.appendParam(params, 'nombreProd', filtro.nombreProd);
    this.appendParam(params, 'codigoBarraProd', filtro.codigoBarraProd);
    this.appendParam(params, 'estadoProd', filtro.estadoProd);
    this.appendParam(params, 'disponibleProd', filtro.disponibleProd);

    return params;
  }

  private appendParam(
    params: URLSearchParams,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined) {
      return;
    }

    const stringValue = String(value).trim();

    if (stringValue === '') {
      return;
    }

    params.append(key, stringValue);
  }
}
