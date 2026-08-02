import { CommonModule, CurrencyPipe, Location } from '@angular/common';

import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import {
  EnumMotivosPedido,
  IDetallePedidoResult,
  IPedidoResult,
} from '@models';

import { PedidosService } from '@services/pedidos.service';

import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import { finalize, forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiCardComponent,
    UiTextFieldComponent,
    UiButtonComponent,
  ],
  providers: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly pedidosService = inject(PedidosService);

  private readonly loadingService = inject(LoadingService);

  private readonly currencyPipe = inject(CurrencyPipe);

  protected readonly location = inject(Location);

  protected pedido: IPedidoResult | null = null;

  protected detalles: IDetallePedidoResult[] = [];

  protected idPedido = -1;

  protected cargando = false;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',
        text: 'El identificador del pedido no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.idPedido = id;

    this.loadPedido();
  }

  protected loadPedido(): void {
    if (this.idPedido <= 0 || this.cargando) {
      return;
    }

    this.cargando = true;

    this.loadingService.show();

    forkJoin({
      pedido: this.pedidosService.buscar(this.idPedido),

      detalles: this.pedidosService.listarDetallesPedido(this.idPedido),
    })
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.loadingService.hide();
        }),
      )
      .subscribe({
        next: (response) => {
          const pedido = response.pedido.data?.[0];

          if (!pedido) {
            this.pedido = null;
            this.detalles = [];

            void Swal.fire({
              icon: 'error',
              title: 'Pedido no encontrado',
              text: 'No se encontró el pedido indicado.',
            }).then(() => {
              this.location.back();
            });

            return;
          }

          this.pedido = pedido;

          this.detalles = (response.detalles.data ??
            []) as IDetallePedidoResult[];
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar',
            text:
              error?.error?.message ?? 'No fue posible consultar el pedido.',
          });
        },
      });
  }

  protected volver(): void {
    this.location.back();
  }

  protected formatCurrency(value: number | string | null | undefined): string {
    const numericValue = Number(value ?? 0);

    return (
      this.currencyPipe.transform(
        Number.isFinite(numericValue) ? numericValue : 0,
        'USD',
        'symbol',
        '1.2-2',
      ) ?? '$0.00'
    );
  }

  protected formatDateTime(value: string | null | undefined): string {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'No disponible';
    }

    const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(
      text,
    );

    if (localMatch) {
      if (localMatch[4] && localMatch[5]) {
        return `${localMatch[1]}/${localMatch[2]}/${localMatch[3]} ${localMatch[4]}:${localMatch[5]}`;
      }

      return `${localMatch[1]}/${localMatch[2]}/${localMatch[3]}`;
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/.exec(
      text,
    );

    if (!isoMatch) {
      return text;
    }

    const date = `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;

    if (!isoMatch[4] || !isoMatch[5]) {
      return date;
    }

    return `${date} ${isoMatch[4]}:${isoMatch[5]}`;
  }

  protected formatDateOnly(value: string | null | undefined): string {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'No aplica';
    }

    const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);

    if (localMatch) {
      return `${localMatch[1]}/${localMatch[2]}/${localMatch[3]}`;
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);

    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }

    return text;
  }

  protected formatText(value: string | null | undefined): string {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'No disponible';
    }

    return text
      .replaceAll('_', ' ')
      .replace(/^\w/, (letter) => letter.toUpperCase());
  }

  protected getEstadoPedidoClass(): string {
    switch (this.pedido?.estado_pedi) {
      case 'emitido':
        return 'pedido-emitido';

      case 'parcial':
        return 'pedido-parcial';

      case 'completado':
        return 'pedido-completado';

      case 'cerrado_incompleto':
        return 'pedido-cerrado';

      case 'cancelado':
        return 'pedido-cancelado';

      default:
        return 'pedido-borrador';
    }
  }

  protected getEstadoBadgeClass(): string {
    switch (this.pedido?.estado_pedi) {
      case 'completado':
        return 'status-success';

      case 'emitido':
        return 'status-info';

      case 'parcial':
        return 'status-middle';

      case 'cerrado_incompleto':
        return 'status-return';

      case 'cancelado':
        return 'status-danger';

      default:
        return 'status-draft';
    }
  }

  protected getEstadoDetalleClass(estado: string): string {
    switch (estado) {
      case 'completo':
        return 'status-success';

      case 'parcial':
        return 'status-middle';

      case 'cerrado_incompleto':
        return 'status-return';

      case 'cancelado':
        return 'status-danger';

      default:
        return 'status-draft';
    }
  }

  protected get motivoLabel(): string {
    if (this.pedido?.motivo_pedi === EnumMotivosPedido.DEVOLUCION) {
      return 'Devolución o canje por caducidad';
    }

    return 'Petición de abastecimiento';
  }

  protected get motivoIcon(): string {
    return this.esDevolucion
      ? 'published_with_changes'
      : 'shopping_cart_checkout';
  }

  protected get esDevolucion(): boolean {
    return this.pedido?.motivo_pedi === EnumMotivosPedido.DEVOLUCION;
  }

  protected get subtotalTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + Number(detalle.subtotal_prod ?? 0),
      0,
    );
  }

  protected get descuentoCompraTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + Number(detalle.dcto_compra_prod ?? 0),
      0,
    );
  }

  protected get descuentoCaducidadTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + Number(detalle.dcto_caduc_prod ?? 0),
      0,
    );
  }

  protected get ivaTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + Number(detalle.iva_prod ?? 0),
      0,
    );
  }

  protected get cantidadProductos(): number {
    return this.detalles.length;
  }

  protected get detallesCompletos(): number {
    return this.detalles.filter(
      (detalle) => detalle.estado_deta_pedi === 'completo',
    ).length;
  }

  protected get detallesPendientes(): number {
    return this.detalles.filter(
      (detalle) =>
        detalle.estado_deta_pedi === 'pendiente' ||
        detalle.estado_deta_pedi === 'parcial',
    ).length;
  }

  protected get cantidadLotesDevolucion(): number {
    return this.detalles.reduce(
      (total, detalle) => total + (detalle.lotes_devolucion?.length ?? 0),
      0,
    );
  }

  protected get cantidadDevolucionTotal(): number {
    return this.detalles.reduce(
      (total, detalle) =>
        total +
        (detalle.lotes_devolucion ?? []).reduce(
          (subtotal, lote) => subtotal + Number(lote.cantidad_devolucion ?? 0),
          0,
        ),
      0,
    );
  }

  protected get cantidadProcesadaTotal(): number {
    return this.detalles.reduce(
      (total, detalle) =>
        total +
        (detalle.lotes_devolucion ?? []).reduce(
          (subtotal, lote) => subtotal + Number(lote.cantidad_procesada ?? 0),
          0,
        ),
      0,
    );
  }

  protected tieneLotesDevolucion(detalle: IDetallePedidoResult): boolean {
    return (detalle.lotes_devolucion?.length ?? 0) > 0;
  }

  protected getEstadoProcesamientoClass(
    cantidad: number,
    procesada: number,
  ): string {
    if (cantidad > 0 && procesada >= cantidad) {
      return 'status-success';
    }

    if (procesada > 0) {
      return 'status-middle';
    }

    return 'status-draft';
  }

  protected getEstadoProcesamientoLabel(
    cantidad: number,
    procesada: number,
  ): string {
    if (cantidad > 0 && procesada >= cantidad) {
      return 'Procesado';
    }

    if (procesada > 0) {
      return 'Procesado parcialmente';
    }

    return 'Pendiente';
  }

  protected get procesoIcon(): string {
    switch (this.pedido?.estado_pedi) {
      case 'emitido':
        return 'send';

      case 'parcial':
        return 'pending_actions';

      case 'completado':
        return 'check_circle';

      case 'cerrado_incompleto':
        return 'rule';

      case 'cancelado':
        return 'cancel';

      default:
        return 'edit_note';
    }
  }

  protected get procesoTitulo(): string {
    switch (this.pedido?.estado_pedi) {
      case 'emitido':
        return 'Pedido emitido';

      case 'parcial':
        return 'Recepción parcial';

      case 'completado':
        return 'Pedido completado';

      case 'cerrado_incompleto':
        return 'Pedido cerrado incompleto';

      case 'cancelado':
        return 'Pedido cancelado';

      default:
        return 'Pedido en borrador';
    }
  }

  protected get procesoDescripcion(): string {
    switch (this.pedido?.estado_pedi) {
      case 'emitido':
        return 'El pedido fue emitido y está pendiente de recepción.';

      case 'parcial':
        return 'Se recibieron algunos productos, pero todavía existen cantidades pendientes.';

      case 'completado':
        return 'Todas las cantidades solicitadas fueron recibidas o procesadas.';

      case 'cerrado_incompleto':
        return 'El pedido fue cerrado sin completar todas las cantidades solicitadas.';

      case 'cancelado':
        return 'El pedido fue cancelado y ya no admite nuevas entregas.';

      default:
        return 'El pedido todavía puede modificarse antes de ser emitido.';
    }
  }
}
