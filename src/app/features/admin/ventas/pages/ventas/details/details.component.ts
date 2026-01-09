import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { VentasService } from '@services/ventas.service';
import { ProductosService } from '@services/productos.service';
import { ClientesService } from '@services/clientes.service';
import { LoadingService } from '@shared/services/loading.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { forkJoin } from 'rxjs';

interface IVentaView {
  ideVent: number;
  ideClie: number;
  nombreCliente: string;
  ideEmpl: number;
  numFacturaVent: string;
  fechaVent: string;
  cantidadVent: number;
  subTotalVent: number;
  totalVent: number;
  dctoSocioVent: number;
  dctoEdadVent: number;
  estadoVent: string;
}

interface IDetalleView {
  ideDetaVent: number;
  ideProd: number;
  nombreProd: string;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  ivaProd: number;
  dctoPromoProd: number;
  totalProd: number;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _ventasService = inject(VentasService);
  private readonly _productosService = inject(ProductosService);
  private readonly _clientesService = inject(ClientesService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _datePipe = inject(DatePipe);
  private readonly _currencyPipe = inject(CurrencyPipe);
  public location = inject(Location);

  protected venta: IVentaView | null = null;
  protected detalles: IDetalleView[] = [];
  protected idVenta!: number;

  private productos: IComboBoxOption[] = [];
  private clientes: IComboBoxOption[] = [];

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idVenta = +idParam;
      this.loadData();
    }
  }

  protected loadData(): void {
    this._loadingService.show();
    
    forkJoin({
      venta: this._ventasService.buscar(this.idVenta),
      detalles: this._ventasService.buscarDetallesVenta(this.idVenta),
      productos: this._productosService.listarComboProductos(),
      clientes: this._clientesService.listarComboClientes()
    }).subscribe({
      next: (res) => {
        this.productos = res.productos;
        this.clientes = res.clientes;
        
        const data = res.venta.data[0] as any;
        const nombreCliente = this.clientes.find(c => +c.value === data.ide_clie)?.label || `ID: ${data.ide_clie}`;
        
        this.venta = {
          ideVent: data.ide_vent,
          ideClie: data.ide_clie,
          nombreCliente: nombreCliente,
          ideEmpl: data.ide_empl,
          numFacturaVent: data.num_factura_vent,
          fechaVent: data.fecha_vent,
          cantidadVent: data.cantidad_vent,
          subTotalVent: data.sub_total_vent,
          totalVent: data.total_vent,
          dctoSocioVent: data.dcto_socio_vent,
          dctoEdadVent: data.dcto_edad_vent,
          estadoVent: data.estado_vent
        };

        this.detalles = res.detalles.data.map((d: any) => {
          const nombreProd = this.productos.find(p => +p.value === d.ide_prod)?.label || `ID: ${d.ide_prod}`;
          return {
            ideDetaVent: d.ide_deta_vent,
            ideProd: d.ide_prod,
            nombreProd: nombreProd,
            cantidadProd: d.cantidad_prod,
            precioUnitarioProd: d.precio_unitario_prod,
            subtotalProd: d.subtotal_prod,
            ivaProd: d.iva_prod,
            dctoPromoProd: d.dcto_promo_prod,
            totalProd: d.total_prod
          };
        });

        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }

  protected formatDate(date: string): string {
    return this._datePipe.transform(date, 'dd/MM/yyyy HH:mm') || date;
  }

  protected formatCurrency(value: number | string): string {
    // Sanitizar el valor - puede venir mal formateado de la BD
    let numValue: number;
    if (typeof value === 'string') {
      // Remover caracteres no numéricos excepto punto y signo negativo
      const cleanValue = value.replace(/[^0-9.-]/g, '');
      numValue = parseFloat(cleanValue) || 0;
    } else {
      numValue = value || 0;
    }
    return this._currencyPipe.transform(numValue, '$') || numValue.toString();
  }

  protected getEstadoClass(estado: string): string {
    switch (estado) {
      case 'completado': return 'estado-completado';
      case 'cancelado': return 'estado-cancelado';
      case 'devuelto': return 'estado-devuelto';
      default: return '';
    }
  }
}
