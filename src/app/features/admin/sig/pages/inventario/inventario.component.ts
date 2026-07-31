import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ISigInventarioResumen,
  ISigLoteCaducidad,
  ISigMovimientoInventario,
  ISigProductoStockCritico,
  ISigReporteMovimientosInventario,
} from '@models';
import { SigService } from '@services/index';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sig-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
})
export default class InventarioComponent implements OnInit {
  private readonly sigService = inject(SigService);

  protected resumen: ISigInventarioResumen | null = null;
  protected productosCriticos: ISigProductoStockCritico[] = [];
  protected lotesCaducidad: ISigLoteCaducidad[] = [];
  protected movimientos: ISigMovimientoInventario[] = [];
  protected reporteMovimientos: ISigReporteMovimientosInventario | null = null;

  protected diasCaducidad = 30;
  protected limite = 20;
  protected desde = '';
  protected hasta = '';
  protected tipoMovimiento = '';

  protected cargando = true;
  protected mensajeError = '';
  protected ultimaConsulta: Date | null = null;

  ngOnInit(): void {
    this.cargarInventario();
  }

  protected cargarInventario(): void {
    if (this.desde && this.hasta && this.desde > this.hasta) {
      this.mensajeError =
        'La fecha desde no puede ser posterior a la fecha hasta.';

      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    forkJoin({
      resumen: this.sigService.obtenerResumenInventario(this.diasCaducidad),

      stock: this.sigService.obtenerStockCritico(this.limite),

      caducidad: this.sigService.obtenerCaducidadInventario(
        this.diasCaducidad,
        this.limite,
      ),

      movimientos: this.sigService.obtenerMovimientosInventario({
        desde: this.desde || undefined,
        hasta: this.hasta || undefined,
        tipo: this.tipoMovimiento || undefined,
        limite: this.limite,
      }),
    })
      .pipe(
        finalize(() => {
          this.cargando = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const respuestasValidas =
            response.resumen.success &&
            response.stock.success &&
            response.caducidad.success &&
            response.movimientos.success;

          if (!respuestasValidas) {
            this.limpiarResultados();

            this.mensajeError =
              'La API SIG no devolvió información de inventario válida.';

            return;
          }

          this.resumen = response.resumen.data;

          this.productosCriticos = response.stock.data.items ?? [];

          this.lotesCaducidad = response.caducidad.data.items ?? [];

          this.reporteMovimientos = response.movimientos.data;

          this.movimientos = response.movimientos.data.items ?? [];

          this.ultimaConsulta = new Date();
        },

        error: (error: unknown) => {
          this.limpiarResultados();

          this.mensajeError = this.obtenerMensajeError(error);
        },
      });
  }

  protected limpiarFiltros(): void {
    this.diasCaducidad = 30;
    this.limite = 20;
    this.desde = '';
    this.hasta = '';
    this.tipoMovimiento = '';

    this.cargarInventario();
  }

  protected etiquetaStock(estado: string): string {
    switch (estado) {
      case 'agotado':
        return 'Agotado';

      case 'stock_bajo':
        return 'Stock bajo';

      default:
        return estado;
    }
  }

  protected etiquetaCaducidad(estado: string): string {
    switch (estado) {
      case 'caducado':
        return 'Caducado';

      case 'proximo_caducar':
        return 'Próximo a caducar';

      default:
        return estado;
    }
  }

  protected etiquetaMovimiento(tipo: string): string {
    return tipo
      .split('_')
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  protected esEntrada(movimiento: ISigMovimientoInventario): boolean {
    return movimiento.cantidad > 0;
  }

  protected valorAbsoluto(cantidad: number): number {
    return Math.abs(cantidad);
  }

  private limpiarResultados(): void {
    this.resumen = null;
    this.productosCriticos = [];
    this.lotesCaducidad = [];
    this.movimientos = [];
    this.reporteMovimientos = null;
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudo cargar la analítica de inventario.';
    }

    if (error.status === 0) {
      return (
        'No se pudo conectar con la API SIG. ' +
        'Comprueba que Go esté ejecutándose.'
      );
    }

    const detalle = error.error as {
      error?: string;
      message?: string;
    } | null;

    if (detalle?.error) {
      return detalle.error;
    }

    if (detalle?.message) {
      return detalle.message;
    }

    return (
      'No se pudo cargar la analítica de inventario. ' + `HTTP ${error.status}.`
    );
  }
}
