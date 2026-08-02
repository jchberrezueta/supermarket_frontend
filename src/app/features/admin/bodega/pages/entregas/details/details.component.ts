import { CommonModule, CurrencyPipe, Location } from '@angular/common';

import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { IDetalleEntregaResult, IEntregaResult } from '@models';

import { EntregasService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import { finalize } from 'rxjs';

import Swal from 'sweetalert2';

type PuntualidadEntrega = 'anticipada' | 'tiempo' | 'atrasada' | 'sin_fecha';

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

  private readonly entregasService = inject(EntregasService);

  private readonly loadingService = inject(LoadingService);

  private readonly currencyPipe = inject(CurrencyPipe);

  protected readonly location = inject(Location);

  protected entrega: IEntregaResult | null = null;

  protected detalles: IDetalleEntregaResult[] = [];

  protected idEntrega = -1;

  protected cargando = false;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',
        text: 'El identificador de la entrega no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.idEntrega = id;

    this.loadEntrega();
  }

  protected loadEntrega(): void {
    if (this.idEntrega <= 0 || this.cargando) {
      return;
    }

    this.cargando = true;

    this.loadingService.show();

    this.entregasService
      .buscar(this.idEntrega)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.loadingService.hide();
        }),
      )
      .subscribe({
        next: (response) => {
          const entrega = response.data?.[0];

          if (!entrega) {
            this.entrega = null;
            this.detalles = [];

            void Swal.fire({
              icon: 'error',
              title: 'Entrega no encontrada',
              text: 'No se encontró la entrega indicada.',
            }).then(() => {
              this.location.back();
            });

            return;
          }

          this.entrega = entrega;

          this.detalles = entrega.detalles ?? [];
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar',
            text:
              error?.error?.message ?? 'No fue posible consultar la entrega.',
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

    if (/^\d{2}\/\d{2}\/\d{4}/.test(text)) {
      return text;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/.exec(
      text,
    );

    if (!match) {
      return text;
    }

    const date = `${match[3]}/${match[2]}/${match[1]}`;

    if (!match[4] || !match[5]) {
      return date;
    }

    return `${date} ${match[4]}:${match[5]}`;
  }

  protected formatDateOnly(value: string | null | undefined): string {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'No aplica';
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);

    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }

    const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);

    if (localMatch) {
      return `${localMatch[1]}/${localMatch[2]}/${localMatch[3]}`;
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

  protected getEstadoEntregaClass(): string {
    switch (this.entrega?.estado_entr) {
      case 'completa':
        return 'entrega-completa';

      case 'parcial':
        return 'entrega-parcial';

      case 'anulada':
        return 'entrega-anulada';

      default:
        return 'entrega-borrador';
    }
  }

  protected getEstadoBadgeClass(): string {
    switch (this.entrega?.estado_entr) {
      case 'completa':
        return 'status-success';

      case 'parcial':
        return 'status-middle';

      case 'anulada':
        return 'status-danger';

      default:
        return 'status-draft';
    }
  }

  protected getEstadoDetalleClass(estado: string): string {
    switch (estado) {
      case 'completo':
        return 'status-success';

      case 'incompleto':
        return 'status-middle';

      default:
        return 'status-neutral';
    }
  }

  protected getEstadoLoteClass(estado: string): string {
    switch (estado) {
      case 'confirmado':
        return 'status-success';

      case 'anulado':
        return 'status-danger';

      default:
        return 'status-draft';
    }
  }

  protected get motivoProceso(): string {
    switch (this.entrega?.motivo_pedi) {
      case 'devolucion':
        return 'Canje por caducidad';

      case 'peticion':
        return 'Petición normal';

      default:
        return 'No identificado';
    }
  }

  protected get puntualidad(): PuntualidadEntrega {
    const fechaReal = this.extraerFechaComparable(this.entrega?.fecha_entr);

    const fechaEsperada = this.extraerFechaComparable(
      this.entrega?.fecha_entr_pedi,
    );

    if (!fechaReal || !fechaEsperada) {
      return 'sin_fecha';
    }

    if (fechaReal < fechaEsperada) {
      return 'anticipada';
    }

    if (fechaReal > fechaEsperada) {
      return 'atrasada';
    }

    return 'tiempo';
  }

  protected get puntualidadLabel(): string {
    switch (this.puntualidad) {
      case 'anticipada':
        return 'Entrega anticipada';

      case 'tiempo':
        return 'Entrega a tiempo';

      case 'atrasada':
        return 'Entrega atrasada';

      default:
        return 'Sin fecha esperada';
    }
  }

  protected get puntualidadIcon(): string {
    switch (this.puntualidad) {
      case 'anticipada':
        return 'flight_takeoff';

      case 'tiempo':
        return 'check_circle';

      case 'atrasada':
        return 'schedule';

      default:
        return 'event_busy';
    }
  }

  protected get puntualidadClass(): string {
    switch (this.puntualidad) {
      case 'anticipada':
      case 'tiempo':
        return 'puntualidad-correcta';

      case 'atrasada':
        return 'puntualidad-atrasada';

      default:
        return 'puntualidad-neutral';
    }
  }

  protected get cantidadSolicitadaTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + Number(detalle.cantidad_pedida ?? 0),
      0,
    );
  }

  protected get subtotalEntrega(): number {
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

  protected get cantidadLotes(): number {
    return this.detalles.reduce(
      (total, detalle) => total + (detalle.lotes_recibidos?.length ?? 0),
      0,
    );
  }

  protected get cantidadDistribuidaLotes(): number {
    return this.detalles.reduce(
      (total, detalle) =>
        total +
        (detalle.lotes_recibidos ?? []).reduce(
          (subtotal, lote) => subtotal + Number(lote.cantidad_lote ?? 0),
          0,
        ),
      0,
    );
  }

  protected tieneLotes(detalle: IDetalleEntregaResult): boolean {
    return (detalle.lotes_recibidos?.length ?? 0) > 0;
  }

  private extraerFechaComparable(
    value: string | null | undefined,
  ): string | null {
    const text = String(value ?? '').trim();

    if (!text) {
      return null;
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);

    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);

    if (localMatch) {
      return `${localMatch[3]}-${localMatch[2]}-${localMatch[1]}`;
    }

    return null;
  }
}
