import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  Location,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IDetalleVentaResult,
  IMovimientoVentaResult,
  IVentaResult,
} from '@models';
import { ClientesService } from '@services/clientes.service';
import { ProductosService } from '@services/productos.service';
import { VentasService } from '@services/ventas.service';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { LoadingService } from '@shared/services/loading.service';
import { finalize, forkJoin } from 'rxjs';
import { UiCardComponent } from '@shared/components/card/card.component';
import { EmpleadosService } from '@services/empleados.service';
import Swal from 'sweetalert2';

interface IVentaView {
  ideVent: number;
  ideClie: number;
  nombreCliente: string;
  ideEmpl: number | null;
  nombreEmpleado: string;
  numFacturaVent: string;
  fechaVent: string;
  cantidadVent: number;
  subTotalVent: number;
  totalVent: number;
  dctoSocioVent: number;
  dctoEdadVent: number;
  estadoVent: string;
  canalVent: string;
  tipoPagoVent: string;
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

interface IMovimientoView {
  ideMovi: number;
  ideDetaVent: number | null;
  ideProd: number;
  nombreProd: string;
  ideLote: number | null;
  fechaCaducidadLote: string | null;
  tipoMovi: string;
  cantidadMovi: number;
  stockProdAnterior: number | null;
  stockProdPosterior: number | null;
  stockLoteAnterior: number | null;
  stockLotePosterior: number | null;
  observacionMovi: string | null;
  usuario: string;
  fecha: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _ventasService = inject(VentasService);
  private readonly _productosService = inject(ProductosService);
  private readonly _clientesService = inject(ClientesService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _datePipe = inject(DatePipe);
  private readonly _currencyPipe = inject(CurrencyPipe);

  public readonly location = inject(Location);

  protected venta: IVentaView | null = null;
  protected detalles: IDetalleView[] = [];
  protected movimientos: IMovimientoView[] = [];
  protected idVenta = -1;
  protected ejecutandoAccion = false;

  private productos: IComboBoxOption[] = [];
  private clientes: IComboBoxOption[] = [];
  private empleados: IComboBoxOption[] = [];

  constructor() {
    const idParam = Number(this._route.snapshot.params['id']);

    if (Number.isInteger(idParam) && idParam > 0) {
      this.idVenta = idParam;
      this.loadData();
    }
  }

  protected loadData(): void {
    if (this.idVenta <= 0) {
      return;
    }

    this._loadingService.show();

    forkJoin({
      venta: this._ventasService.buscar(this.idVenta),
      detalles: this._ventasService.buscarDetallesVenta(this.idVenta),
      trazabilidad: this._ventasService.buscarTrazabilidadVenta(this.idVenta),
      productos: this._productosService.listarComboProductos(),
      clientes: this._clientesService.listarComboClientes(),
      empleados: this._empleadosService.listarComboEmpleados(),
    })
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe({
        next: (res) => {
          this.productos = res.productos ?? [];
          this.clientes = res.clientes ?? [];
          this.empleados = res.empleados ?? [];

          const data = res.venta.data?.[0] as IVentaResult | undefined;

          if (!data) {
            this.venta = null;
            this.detalles = [];
            this.movimientos = [];
            return;
          }

          this.venta = {
            ideVent: data.ide_vent,
            ideClie: data.ide_clie,
            nombreCliente: this.nombreCliente(data.ide_clie),
            ideEmpl: data.ide_empl ?? null,
            nombreEmpleado:
              String(data.canal_vent ?? '')
                .trim()
                .toLowerCase() === 'pos' &&
              data.ide_empl !== null &&
              data.ide_empl !== undefined
                ? this.nombreEmpleado(data.ide_empl)
                : 'No aplica',
            numFacturaVent: data.num_factura_vent,
            fechaVent: data.fecha_vent,
            cantidadVent: Number(data.cantidad_vent),
            subTotalVent: Number(data.sub_total_vent),
            totalVent: Number(data.total_vent),
            dctoSocioVent: Number(data.dcto_socio_vent),
            dctoEdadVent: Number(data.dcto_edad_vent),
            estadoVent: data.estado_vent,
            canalVent: this.formatearCanal(data.canal_vent),
            tipoPagoVent: this.formatearTipoPago(data.tipo_pago_vent),
          };

          this.detalles = (res.detalles.data ?? []).map(
            (detalle: IDetalleVentaResult) => ({
              ideDetaVent: detalle.ide_deta_vent,
              ideProd: detalle.ide_prod,
              nombreProd: this.nombreProducto(detalle.ide_prod),
              cantidadProd: Number(detalle.cantidad_prod),
              precioUnitarioProd: Number(detalle.precio_unitario_prod),
              subtotalProd: Number(detalle.subtotal_prod),
              ivaProd: Number(detalle.iva_prod),
              dctoPromoProd: Number(detalle.dcto_promo_prod),
              totalProd: Number(detalle.total_prod),
            }),
          );

          this.movimientos = (res.trazabilidad.data ?? []).map(
            (movimiento: IMovimientoVentaResult) => ({
              ideMovi: movimiento.ide_movi,
              ideDetaVent: movimiento.ide_deta_vent,
              ideProd: movimiento.ide_prod,
              nombreProd: this.nombreProducto(movimiento.ide_prod),
              ideLote: movimiento.ide_lote,
              fechaCaducidadLote: movimiento.fecha_caducidad_lote,
              tipoMovi: movimiento.tipo_movi,
              cantidadMovi: Number(movimiento.cantidad_movi),
              stockProdAnterior: movimiento.stock_prod_anterior,
              stockProdPosterior: movimiento.stock_prod_posterior,
              stockLoteAnterior: movimiento.stock_lote_anterior,
              stockLotePosterior: movimiento.stock_lote_posterior,
              observacionMovi: movimiento.observacion_movi,
              usuario: movimiento.usua_ingre,
              fecha: movimiento.fecha_ingre,
            }),
          );
        },
        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar la venta',
            text:
              error?.error?.message ??
              'No fue posible consultar la venta y su trazabilidad.',
          });
        },
      });
  }

  protected solicitarCancelacion(): void {
    if (this.ejecutandoAccion || !this.puedeAnular()) {
      return;
    }

    void Swal.fire({
      icon: 'warning',
      title: 'Anular venta',
      text: 'Se restaurarán el producto y los lotes exactos que fueron consumidos.',
      input: 'textarea',
      inputLabel: 'Motivo de anulación',
      inputPlaceholder: 'Escriba un motivo de 5 a 250 caracteres.',
      inputAttributes: {
        maxlength: '250',
        'aria-label': 'Motivo de anulación de la venta',
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, anular venta',
      cancelButtonText: 'Volver',
      inputValidator: (value) => {
        const motivo = String(value ?? '').trim();

        if (motivo.length < 5) {
          return 'El motivo debe tener al menos 5 caracteres.';
        }

        if (motivo.length > 250) {
          return 'El motivo no puede superar 250 caracteres.';
        }

        return undefined;
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.cancelarVenta(String(result.value ?? '').trim());
    });
  }

  protected volver(): void {
    this.location.back();
  }

  protected puedeAnular(): boolean {
    return (
      this.venta?.estadoVent === 'completado' &&
      this.movimientos.some(
        (movimiento) => movimiento.tipoMovi === 'salida_venta',
      )
    );
  }

  protected totalIva(): number {
    return this.detalles.reduce((total, detalle) => total + detalle.ivaProd, 0);
  }

  protected totalDescuentoPromocional(): number {
    return this.detalles.reduce(
      (total, detalle) => total + detalle.dctoPromoProd,
      0,
    );
  }

  protected totalDescuentos(): number {
    return (
      this.totalDescuentoPromocional() +
      Number(this.venta?.dctoSocioVent ?? 0) +
      Number(this.venta?.dctoEdadVent ?? 0)
    );
  }

  protected totalSubtotalDetalles(): number {
    return this.detalles.reduce(
      (total, detalle) => total + detalle.subtotalProd,
      0,
    );
  }

  protected cantidadMovimiento(value: number): string {
    if (value > 0) {
      return `+${value}`;
    }

    return String(value);
  }

  protected getVentaClass(estado: string): string {
    switch (estado) {
      case 'cancelado':
        return 'venta-cancelada';

      case 'devuelto':
        return 'venta-devuelta';

      default:
        return 'venta-completada';
    }
  }

  protected iconoCanal(): string {
    const canal = this.venta?.canalVent.toLowerCase() ?? '';

    if (canal.includes('móvil')) {
      return 'smartphone';
    }

    if (canal.includes('punto de venta')) {
      return 'point_of_sale';
    }

    return 'storefront';
  }

  protected formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'No disponible';
    }

    return this._datePipe.transform(date, 'dd/MM/yyyy HH:mm') || date;
  }

  protected formatCalendarDate(date: string | null | undefined): string {
    if (!date) {
      return 'No aplica';
    }

    return this._datePipe.transform(`${date}T00:00:00`, 'dd/MM/yyyy') || date;
  }

  protected formatCurrency(value: number | string): string {
    const numValue = Number(value ?? 0);
    return (
      this._currencyPipe.transform(numValue, 'USD', 'symbol', '1.2-2') || '0.00'
    );
  }

  protected formatearMovimiento(value: string): string {
    switch (value) {
      case 'salida_venta':
        return 'Salida por venta';

      case 'anulacion_venta':
        return 'Anulación de venta';

      case 'devolucion_venta':
        return 'Devolución de venta';

      default:
        return value
          .replaceAll('_', ' ')
          .replace(/^\w/, (letter) => letter.toUpperCase());
    }
  }

  protected getEstadoClass(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'estado-completado';
      case 'cancelado':
        return 'estado-cancelado';
      case 'devuelto':
        return 'estado-devuelto';
      default:
        return '';
    }
  }

  private cancelarVenta(motivo: string): void {
    this.ejecutandoAccion = true;

    this._ventasService
      .cancelar(this.idVenta, motivo)
      .pipe(finalize(() => (this.ejecutandoAccion = false)))
      .subscribe({
        next: (response) => {
          const success = Number(response.p_result) === 1;

          void Swal.fire({
            icon: success ? 'success' : 'error',
            title: success ? 'Venta anulada' : 'Operación rechazada',
            text: this.mensajeRespuesta(
              response.p_response,
              success
                ? 'La venta y su inventario fueron revertidos.'
                : 'No se pudo anular la venta.',
            ),
          }).then(() => {
            if (success) {
              this.loadData();
            }
          });
        },
        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo anular la venta',
            text:
              error?.error?.message ??
              error?.message ??
              'Ocurrió un error inesperado.',
          });
        },
      });
  }

  private nombreCliente(ideClie: number): string {
    return (
      this.clientes.find((cliente) => Number(cliente.value) === ideClie)
        ?.label ?? `Cliente #${ideClie}`
    );
  }

  private nombreEmpleado(ideEmpl: number): string {
    return (
      this.empleados.find((empleado) => Number(empleado.value) === ideEmpl)
        ?.label ?? `Empleado #${ideEmpl}`
    );
  }

  private nombreProducto(ideProd: number): string {
    return (
      this.productos.find((producto) => Number(producto.value) === ideProd)
        ?.label ?? `Producto #${ideProd}`
    );
  }

  private formatearCanal(value: string | null | undefined): string {
    switch (value) {
      case 'pos':
        return 'Punto de venta';

      case 'movil':
      case 'mobile':
        return 'Tienda móvil';

      default:
        return value || 'No identificado';
    }
  }

  private formatearTipoPago(value: string | null | undefined): string {
    switch (value) {
      case 'efectivo':
        return 'Efectivo';
      case 'tarjeta_credito':
        return 'Tarjeta de crédito';
      case 'tarjeta_debito':
        return 'Tarjeta de débito';
      case 'paypal':
        return 'PayPal';
      default:
        return value || 'No registrado';
    }
  }

  private mensajeRespuesta(
    response: string | undefined,
    fallback: string,
  ): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as { message?: string };
      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }
}
