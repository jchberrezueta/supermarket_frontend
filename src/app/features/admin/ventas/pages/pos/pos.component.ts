import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as QRCode from 'qrcode';
import { QrLabelComponent } from '@shared/components/qr-label/qr-label.component';

import {
  IAlertaStockPos,
  IClientePos,
  IProductoPos,
  IVentaPosResponse,
  PosService,
} from '@services/pos.service';
import { PosScanService } from '@services/pos-scan.service';

type TipoPagoPos = 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

interface ICarritoPosItem {
  producto: IProductoPos;
  cantidad: number;
  precioUnitario: number;
  descuentoUnitario: number;
  tasaIva: number;
  subtotalBruto: number;
  descuento: number;
  baseImponible: number;
  iva: number;
  total: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DecimalPipe,
    QrLabelComponent,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
})
export default class PosComponent implements OnInit, OnDestroy {
  private readonly posService = inject(PosService);
  private readonly posScanService = inject(PosScanService);
  private scanSubscription?: Subscription;

  public codigoQrPrueba = 'PRD-000000003';

  public posSessionId = '';
  public scannerToken = '';

  public scannerUrl = '';
  public scannerQrDataUrl = '';
  public ultimoCodigoEscaneado = '';
  public scannerActivo = false;
  public creandoSesionScanner = false;

  public codigoProducto = '';

  public cedulaCliente = '';
  public clienteSeleccionado: IClientePos | null = null;
  public buscandoCliente = false;

  public tipoPagoVent: TipoPagoPos = 'efectivo';

  public carrito: ICarritoPosItem[] = [];
  public ultimaVenta: IVentaPosResponse | null = null;
  public alertasStock: IAlertaStockPos[] = [];

  public loadingProducto = false;
  public procesandoVenta = false;
  public procesandoCancelacion = false;

  public successMessage = '';
  public errorMessage = '';

  public ngOnInit(): void {
    this.crearSesionScanner();
  }

  public ngOnDestroy(): void {
    this.scanSubscription?.unsubscribe();
    this.posScanService.desconectar();
  }

  public buscarProducto(): void {
    const codigo = this.codigoProducto.trim();

    this.buscarYAgregarProductoPorCodigo(codigo, 'manual');
  }

  private buscarYAgregarProductoPorCodigo(
    codigo: string,
    origen: 'manual' | 'scanner',
  ): void {
    this.limpiarMensajes();

    if (!codigo) {
      this.errorMessage = 'Ingrese o escanee un código de producto.';
      return;
    }

    this.loadingProducto = true;

    this.posService.buscarProductoPorCodigo(codigo).subscribe({
      next: (resp) => {
        this.agregarProducto(resp.data);
        this.codigoProducto = '';

        this.successMessage =
          origen === 'scanner'
            ? `Producto escaneado: ${resp.data.nombreProd}`
            : `Producto agregado: ${resp.data.nombreProd}`;

        if (origen === 'scanner') {
          this.reproducirBeep();
        }

        this.loadingProducto = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo encontrar el producto.';
        this.loadingProducto = false;
      },
    });
  }

  private crearSesionScanner(): void {
    this.creandoSesionScanner = true;

    this.posScanService.crearSesion().subscribe({
      next: (resp) => {
        this.posSessionId = resp.data.sessionId;
        this.scannerToken = resp.data.scannerToken;
        this.scannerUrl = this.posScanService.buildScannerUrl(
          this.posSessionId,
          this.scannerToken,
        );

        this.generarQrVinculacion(this.scannerUrl);

        this.posScanService.conectarPos(this.posSessionId);

        this.scanSubscription = this.posScanService
          .onProductoEscaneado()
          .subscribe((event) => {
            this.ultimoCodigoEscaneado = event.codigo;
            this.buscarYAgregarProductoPorCodigo(event.codigo, 'scanner');
          });

        this.scannerActivo = true;
        this.creandoSesionScanner = false;
      },
      error: () => {
        this.scannerActivo = false;
        this.creandoSesionScanner = false;
        this.errorMessage = 'No se pudo crear la sesión del escáner móvil.';
      },
    });
  }

  private reproducirBeep(): void {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

      gain.gain.setValueAtTime(0.08, audioContext.currentTime);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.09);
    } catch {
      // Si el navegador bloquea audio automático, no rompemos el POS.
    }
  }

  public agregarProducto(producto: IProductoPos): void {
    if (producto.stockProd <= 0 || producto.disponibleProd !== 'si') {
      this.errorMessage = `El producto ${producto.nombreProd} no tiene stock disponible.`;
      return;
    }

    const itemExistente = this.carrito.find(
      (item) => item.producto.ideProd === producto.ideProd,
    );

    if (itemExistente) {
      if (itemExistente.cantidad + 1 > itemExistente.producto.stockProd) {
        this.errorMessage = `No puede agregar más unidades de ${producto.nombreProd}. Stock disponible: ${producto.stockProd}.`;
        return;
      }

      itemExistente.cantidad += 1;
      this.recalcularItem(itemExistente);
      return;
    }

    const nuevoItem: ICarritoPosItem = {
      producto,
      cantidad: 1,
      precioUnitario: this.toNumber(producto.precioVentaProd),
      descuentoUnitario: this.toNumber(producto.dctoPromoProd),
      tasaIva: this.normalizarTasaIva(producto.ivaProd),
      subtotalBruto: 0,
      descuento: 0,
      baseImponible: 0,
      iva: 0,
      total: 0,
    };

    this.recalcularItem(nuevoItem);
    this.carrito.push(nuevoItem);
  }

  public aumentarCantidad(item: ICarritoPosItem): void {
    this.limpiarMensajes();

    if (item.cantidad + 1 > item.producto.stockProd) {
      this.errorMessage = `Stock máximo alcanzado para ${item.producto.nombreProd}. Disponible: ${item.producto.stockProd}.`;
      return;
    }

    item.cantidad += 1;
    this.recalcularItem(item);
  }

  public disminuirCantidad(item: ICarritoPosItem): void {
    if (item.cantidad <= 1) {
      this.quitarProducto(item.producto.ideProd);
      return;
    }

    item.cantidad -= 1;
    this.recalcularItem(item);
  }

  public cambiarCantidad(item: ICarritoPosItem): void {
    this.limpiarMensajes();

    if (!item.cantidad || item.cantidad < 1) {
      item.cantidad = 1;
    }

    if (item.cantidad > item.producto.stockProd) {
      item.cantidad = item.producto.stockProd;
      this.errorMessage = `La cantidad no puede superar el stock disponible de ${item.producto.nombreProd}.`;
    }

    this.recalcularItem(item);
  }

  public quitarProducto(ideProd: number): void {
    this.carrito = this.carrito.filter(
      (item) => item.producto.ideProd !== ideProd,
    );
  }

  public limpiarVenta(): void {
    this.carrito = [];
    this.ultimaVenta = null;
    this.alertasStock = [];
    this.limpiarMensajes();
  }

  public confirmarVenta(): void {
    this.limpiarMensajes();
    this.alertasStock = [];

    if (!this.clienteSeleccionado) {
      this.errorMessage =
        'Debe buscar y seleccionar un cliente antes de vender.';
      return;
    }

    if (!this.carrito.length) {
      this.errorMessage = 'Debe agregar productos al carrito.';
      return;
    }

    this.procesandoVenta = true;

    this.posService
      .confirmarVenta({
        ideClie: this.clienteSeleccionado.ideClie,
        tipoPagoVent: this.tipoPagoVent,
        items: this.carrito.map((item) => ({
          ideProd: item.producto.ideProd,
          cantidad: item.cantidad,
        })),
      })
      .subscribe({
        next: (resp) => {
          this.ultimaVenta = resp.data;
          this.alertasStock = resp.data.alertasStock || [];
          this.successMessage = resp.response.message;
          this.carrito = [];
          this.procesandoVenta = false;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'No se pudo confirmar la venta.';
          this.procesandoVenta = false;
        },
      });
  }

  public cancelarUltimaVenta(): void {
    this.limpiarMensajes();

    if (!this.ultimaVenta) {
      this.errorMessage = 'No existe una venta reciente para cancelar.';
      return;
    }

    this.procesandoCancelacion = true;

    this.posService.cancelarVenta(this.ultimaVenta.ideVent).subscribe({
      next: (resp) => {
        this.successMessage = resp.response.message;
        this.procesandoCancelacion = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cancelar la venta.';
        this.procesandoCancelacion = false;
      },
    });
  }

  public get cantidadTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  public get subtotalVenta(): number {
    return this.redondear(
      this.carrito.reduce((total, item) => total + item.baseImponible, 0),
    );
  }

  public get ivaVenta(): number {
    return this.redondear(
      this.carrito.reduce((total, item) => total + item.iva, 0),
    );
  }

  public get descuentoVenta(): number {
    return this.redondear(
      this.carrito.reduce((total, item) => total + item.descuento, 0),
    );
  }

  public get totalVenta(): number {
    return this.redondear(
      this.carrito.reduce((total, item) => total + item.total, 0),
    );
  }

  public get carritoTieneStockValido(): boolean {
    return this.carrito.every(
      (item) => item.cantidad <= item.producto.stockProd,
    );
  }

  public get nombreClienteSeleccionado(): string {
    if (!this.clienteSeleccionado) {
      return 'Sin cliente seleccionado';
    }

    const nombres = [
      this.clienteSeleccionado.primerNombreClie,
      this.clienteSeleccionado.segundoNombreClie,
      this.clienteSeleccionado.apellidoPaternoClie,
      this.clienteSeleccionado.apellidoMaternoClie,
    ]
      .filter(Boolean)
      .join(' ');

    return nombres;
  }

  private async generarQrVinculacion(url: string): Promise<void> {
    try {
      this.scannerQrDataUrl = await QRCode.toDataURL(url, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error('No se pudo generar el QR de vinculación', error);
      this.scannerQrDataUrl = '';
    }
  }

  public trackByProducto(_index: number, item: ICarritoPosItem): number {
    return item.producto.ideProd;
  }

  private recalcularItem(item: ICarritoPosItem): void {
    const subtotalBruto = this.redondear(item.precioUnitario * item.cantidad);
    const descuento = this.redondear(item.descuentoUnitario * item.cantidad);
    const baseImponible = this.redondear(
      Math.max(subtotalBruto - descuento, 0),
    );
    const iva = this.redondear(baseImponible * item.tasaIva);
    const total = this.redondear(baseImponible + iva);

    item.subtotalBruto = subtotalBruto;
    item.descuento = descuento;
    item.baseImponible = baseImponible;
    item.iva = iva;
    item.total = total;
  }

  private limpiarMensajes(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return 0;
    }

    return parsedValue;
  }

  private normalizarTasaIva(value: string | number | null | undefined): number {
    const iva = this.toNumber(value);

    if (iva > 1) {
      return iva / 100;
    }

    return iva;
  }

  private redondear(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  public buscarCliente(): void {
    const cedula = this.cedulaCliente.trim();

    this.limpiarMensajes();

    if (!cedula) {
      this.errorMessage = 'Ingrese la cédula del cliente.';
      return;
    }

    this.buscandoCliente = true;

    this.posService.buscarClientePorCedula(cedula).subscribe({
      next: (resp) => {
        this.clienteSeleccionado = resp.data;
        this.successMessage = `Cliente seleccionado: ${this.nombreClienteSeleccionado}`;
        this.buscandoCliente = false;
      },
      error: (error) => {
        this.clienteSeleccionado = null;
        this.errorMessage =
          error?.error?.message || 'No se pudo encontrar el cliente.';
        this.buscandoCliente = false;
      },
    });
  }

  public limpiarCliente(): void {
    this.clienteSeleccionado = null;
    this.cedulaCliente = '';
  }
}
