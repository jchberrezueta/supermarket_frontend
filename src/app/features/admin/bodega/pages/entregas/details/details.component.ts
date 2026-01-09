import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { EntregasService, ProveedoresService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';
import { IEntregaResult } from '@models';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { forkJoin } from 'rxjs';

interface IEntregaView {
  ideEntr: number;
  idePedi: number;
  ideProv: number;
  fechaEntr: string;
  cantidadTotalEntr: number;
  totalEntr: number;
  estadoEntr: string;
  observacionEntr: string;
  nombreProveedor?: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _entregasService = inject(EntregasService);
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _datePipe = inject(DatePipe);
  private readonly _currencyPipe = inject(CurrencyPipe);
  public location = inject(Location);

  protected entrega: IEntregaView | null = null;
  protected idEntrega!: number;

  // Config para la tabla de detalles
  protected detallesConfig = {
    dataKey: 'ide_deta_entr',
    columns: [
      { label: 'ID', property: 'ide_deta_entr', type: 'text' },
      { label: 'Producto', property: 'nombre_prod', type: 'text' },
      { label: 'Cantidad', property: 'cantidad_prod', type: 'text' },
      { label: 'Precio Unit.', property: 'precio_unitario_prod', type: 'currency' },
      { label: 'Subtotal', property: 'subtotal_prod', type: 'currency' },
      { label: 'Dcto. Compra', property: 'dcto_compra_prod', type: 'currency' },
      { label: 'IVA', property: 'iva_prod', type: 'currency' },
      { label: 'Total', property: 'total_prod', type: 'currency' },
      { label: 'Estado', property: 'estado_deta_entr', type: 'text' },
    ]
  };

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idEntrega = +idParam;
      this.loadEntrega();
    }
  }

  protected loadEntrega(): void {
    this._loadingService.show();
    
    forkJoin({
      entrega: this._entregasService.buscar(this.idEntrega),
      proveedores: this._proveedoresService.listarComboProveedores()
    }).subscribe({
      next: ({ entrega, proveedores }) => {
        const data = entrega.data[0] as IEntregaResult;
        
        // Buscar nombre del proveedor
        const proveedor = proveedores.find(p => p.value === data.ide_prov);
        
        this.entrega = {
          ideEntr: data.ide_entr,
          idePedi: data.ide_pedi,
          ideProv: data.ide_prov,
          fechaEntr: data.fecha_entr,
          cantidadTotalEntr: data.cantidad_total_entr,
          totalEntr: data.total_entr,
          estadoEntr: data.estado_entr,
          observacionEntr: data.observacion_entr,
          nombreProveedor: proveedor?.label || `Proveedor #${data.ide_prov}`
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected formatDate(date: string): string {
    return this._datePipe.transform(date, 'dd/MM/yyyy HH:mm') || date;
  }

  protected formatCurrency(value: number): string {
    return this._currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') || `$${value}`;
  }

  protected volver(): void {
    this.location.back();
  }
}
