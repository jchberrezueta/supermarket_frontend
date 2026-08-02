import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMovimientoInventarioResult } from '@models';
import { MovimientosInventarioService } from '@services/movimientos-inventario.service';

import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-movimiento',
  standalone: true,
  imports: [UiCardComponent, UiButtonComponent, UiTextFieldComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly movimientosService = inject(MovimientosInventarioService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected movimiento: IMovimientoInventarioResult | null = null;

  protected idMovimiento = -1;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',
        text: 'El identificador del movimiento no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.idMovimiento = id;
    this.loadData();
  }

  protected loadData(): void {
    if (this.idMovimiento <= 0) {
      return;
    }

    this.loadingService.show();

    this.movimientosService.buscar(this.idMovimiento).subscribe({
      next: (response) => {
        this.loadingService.hide();

        const movimiento = response.data[0];

        if (!movimiento) {
          this.movimiento = null;

          void Swal.fire({
            icon: 'error',
            title: 'Movimiento no encontrado',
            text: 'No se encontró el movimiento de inventario indicado.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.movimiento = movimiento;
      },

      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',
          text: this.extractError(error),
        });
      },
    });
  }

  protected volver(): void {
    this.location.back();
  }

  protected esEntrada(): boolean {
    return Number(this.movimiento?.cantidad_movi ?? 0) > 0;
  }

  protected esSalida(): boolean {
    return Number(this.movimiento?.cantidad_movi ?? 0) < 0;
  }

  protected tipoOperacion(): string {
    if (this.esEntrada()) {
      return 'Entrada de inventario';
    }

    if (this.esSalida()) {
      return 'Salida de inventario';
    }

    return 'Movimiento sin variación';
  }

  protected iconoOperacion(): string {
    if (this.esEntrada()) {
      return 'inventory';
    }

    if (this.esSalida()) {
      return 'outbox';
    }

    return 'sync_alt';
  }

  protected cantidadMostrada(): string {
    const cantidad = Number(this.movimiento?.cantidad_movi ?? 0);

    if (cantidad > 0) {
      return `+${cantidad}`;
    }

    return String(cantidad);
  }

  protected formatFechaIngreso(fecha: string | null | undefined): string {
    return fecha?.trim() || 'No disponible';
  }

  protected formatFechaCaducidad(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'No aplica';
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);

    if (!match) {
      return fecha;
    }

    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  protected formatNullableNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'No aplica';
    }

    return String(value);
  }

  protected formatText(value: string | null | undefined): string {
    if (!value?.trim()) {
      return 'No disponible';
    }

    return value
      .replaceAll('_', ' ')
      .replace(/^\w/, (letter) => letter.toUpperCase());
  }

  private extractError(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'No fue posible consultar el movimiento de inventario.';
  }
}
