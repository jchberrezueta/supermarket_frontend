import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PedidosService } from '@services/pedidos.service';
import { EmpresasService } from '@services/empresas.service';
import { ProductosService } from '@services/productos.service';
import { LoadingService } from '@shared/services/loading.service';

interface IPedidoView {
  idePedi: number;
  ideEmpr: number;
  nombreEmpr: string;
  fechaPedi: string;
  fechaEntrPedi: string;
  cantidadTotalPedi: number;
  totalPedi: number;
  estadoPedi: string;
  motivoPedi: string;
  observacionPedi: string;
}

interface IDetalleView {
  ideProd: number;
  nombreProd: string;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  ivaProd: number;
  dctoCompraProd: number;
  dctoCaducProd: number;
  totalProd: number;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiCardComponent,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _productosService = inject(ProductosService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected pedido: IPedidoView | null = null;
  protected detalles: IDetalleView[] = [];
  protected idPedido!: number;
  private productos: { value: string; label: string }[] = [];

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idPedido = +idParam;
      this.loadProductos();
      this.loadPedido();
    }
  }

  private loadProductos(): void {
    this._productosService.listarComboProductos().subscribe((res: any) => {
      this.productos = res.map((item: any) => ({
        value: item.value.toString(),
        label: item.label
      }));
    });
  }

  protected loadPedido(): void {
    this._loadingService.show();
    this._pedidosService.buscar(this.idPedido).subscribe({
      next: (res) => {
        const data = res.data[0];
        this.pedido = {
          idePedi: data.ide_pedi,
          ideEmpr: data.ide_empr,
          nombreEmpr: '',
          fechaPedi: data.fecha_pedi,
          fechaEntrPedi: data.fecha_entr_pedi,
          cantidadTotalPedi: data.cantidad_total_pedi,
          totalPedi: data.total_pedi,
          estadoPedi: data.estado_pedi,
          motivoPedi: data.motivo_pedi,
          observacionPedi: data.observacion_pedi
        };
        // Cargar nombre empresa
        this.loadEmpresa(data.ide_empr);
        // Cargar detalles
        this.loadDetalles();
      },
      error: () => this._loadingService.hide()
    });
  }

  private loadEmpresa(idEmpr: number): void {
    this._empresasService.buscar(idEmpr).subscribe({
      next: (res) => {
        if (res.data && res.data[0] && this.pedido) {
          this.pedido.nombreEmpr = res.data[0].nombre_empr;
        }
      }
    });
  }

  private loadDetalles(): void {
    this._pedidosService.listarDetallesPedido(this.idPedido).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.detalles = res.data.map((d: any) => {
            const nombreProd = this.productos.find(p => +p.value === d.ide_prod)?.label || `Producto #${d.ide_prod}`;
            return {
              ideProd: d.ide_prod,
              nombreProd: nombreProd,
              cantidadProd: d.cantidad_prod,
              precioUnitarioProd: d.precio_unitario_prod,
              subtotalProd: d.subtotal_prod,
              ivaProd: d.iva_prod || 0,
              dctoCompraProd: d.dcto_compra_prod || 0,
              dctoCaducProd: d.dcto_caduc_prod || 0,
              totalProd: d.total_prod || d.subtotal_prod
            };
          });
        }
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }
}
