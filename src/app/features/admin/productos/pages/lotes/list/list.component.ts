import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from "@shared/components/button/button.component";
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroLote, ListEstadosLote } from 'app/models';
import { ListLotesConfig } from './list_lotes.config';
import { LotesService, ProductosService } from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent
];

type filterLoteFormGroup = FormGroupOf<IFiltroLote>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  protected readonly config = ListLotesConfig;
  private readonly _lotesService = inject(LotesService);
  private readonly _productosService = inject(ProductosService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected opcionesProductos!: IComboBoxOption[];
  protected opcionesEstados!: IComboBoxOption[];
  protected formData!: filterLoteFormGroup;
  private initialFormValue!: IFiltroLote;


  constructor() {
    this.loadComboProductos();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      ideLote: [0, [], []],
      ideProd: [0, [], []],
      fechaCaducidadLoteDesde: ['', [], []],
      fechaCaducidadLoteHasta: ['', [], []],
      stockLoteMin: [0, [], []],
      stockLoteMax: [0, [], []],
      estadoLote: ['', [], []],
    }) as filterLoteFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboProductos() {
    this._productosService.listarComboProductos().subscribe(
      (res: IComboBoxOption[]) => {
        this.opcionesProductos = res;
      }
    );
  }

  private loadComboEstados() {
    this.opcionesEstados = ListEstadosLote;
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroLote;
    if (isValidStringValue(filtro.ideLote+'') && filtro.ideLote > 0) params.append('ideLote', filtro.ideLote+'' );
    if (isValidStringValue(filtro.ideProd+'') && filtro.ideProd > 0) params.append('ideProd', filtro.ideProd+'' );
    if (isValidStringValue(filtro.fechaCaducidadLoteDesde)) params.append('fechaCaducidadLoteDesde', filtro.fechaCaducidadLoteDesde );
    if (isValidStringValue(filtro.fechaCaducidadLoteHasta)) params.append('fechaCaducidadLoteHasta', filtro.fechaCaducidadLoteHasta );
    if (isValidStringValue(filtro.stockLoteMin+'') && filtro.stockLoteMin > 0) params.append('stockLoteMin', filtro.stockLoteMin+'' );
    if (isValidStringValue(filtro.stockLoteMax+'') && filtro.stockLoteMax > 0) params.append('stockLoteMax', filtro.stockLoteMax+'' );
    if (isValidStringValue(filtro.estadoLote)) params.append('estadoLote', filtro.estadoLote );
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