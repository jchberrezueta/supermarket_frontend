import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ISigDesempenoProveedor,
  ISigPedidoAbastecimiento,
  ISigReportePedidosAbastecimiento,
  ISigResumenAbastecimiento,
} from '@models';
import { SigService } from '@services/index';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sig-abastecimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abastecimiento.component.html',
  styleUrl: './abastecimiento.component.scss',
})
export default class AbastecimientoComponent implements OnInit {
  private readonly sigService = inject(SigService);

  protected resumen: ISigResumenAbastecimiento | null = null;

  protected proveedores: ISigDesempenoProveedor[] = [];

  protected pedidos: ISigPedidoAbastecimiento[] = [];

  protected reportePedidos: ISigReportePedidosAbastecimiento | null = null;

  protected estadoPedido = '';
  protected limite = 20;

  protected cargando = true;
  protected mensajeError = '';
  protected ultimaConsulta: Date | null = null;

  ngOnInit(): void {
    this.cargarAbastecimiento();
  }

  protected cargarAbastecimiento(): void {
    this.cargando = true;
    this.mensajeError = '';

    forkJoin({
      resumen: this.sigService.obtenerResumenAbastecimiento(),

      proveedores: this.sigService.obtenerDesempenoProveedores(this.limite),

      pedidos: this.sigService.obtenerPedidosAbastecimiento({
        estado: this.estadoPedido || undefined,
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
            response.proveedores.success &&
            response.pedidos.success;

          if (!respuestasValidas) {
            this.limpiarResultados();

            this.mensajeError =
              'La API SIG no devolvió información de abastecimiento válida.';

            return;
          }

          this.resumen = response.resumen.data;

          this.proveedores = response.proveedores.data.items ?? [];

          this.reportePedidos = response.pedidos.data;

          this.pedidos = response.pedidos.data.items ?? [];

          this.ultimaConsulta = new Date();
        },

        error: (error: unknown) => {
          this.limpiarResultados();

          this.mensajeError = this.obtenerMensajeError(error);
        },
      });
  }

  protected limpiarFiltros(): void {
    this.estadoPedido = '';
    this.limite = 20;

    this.cargarAbastecimiento();
  }

  protected etiquetaEstado(estado: string): string {
    const estadoNormalizado = estado.trim().toLowerCase();

    switch (estadoNormalizado) {
      case 'completado':
      case 'completada':
      case 'completo':
      case 'completa':
        return 'Completado';

      case 'cancelado':
      case 'cancelada':
      case 'anulado':
      case 'anulada':
        return 'Cancelado';

      case 'pendiente':
        return 'Pendiente';

      case 'en_proceso':
        return 'En proceso';

      default:
        return estado
          .split('_')
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ');
    }
  }

  protected esEstadoCompletado(estado: string): boolean {
    const estadoNormalizado = estado.trim().toLowerCase();

    return [
      'completado',
      'completada',
      'completo',
      'completa',
      'completed',
    ].includes(estadoNormalizado);
  }

  protected esEstadoCancelado(estado: string): boolean {
    const estadoNormalizado = estado.trim().toLowerCase();

    return ['cancelado', 'cancelada', 'anulado', 'anulada'].includes(
      estadoNormalizado,
    );
  }

  protected porcentajeSeguro(porcentaje: number): number {
    if (!Number.isFinite(porcentaje)) {
      return 0;
    }

    return Math.min(100, Math.max(0, porcentaje));
  }

  protected porcentajeRecepcion(pedido: ISigPedidoAbastecimiento): number {
    return this.porcentajeSeguro(pedido.porcentajeCumplimiento);
  }

  protected tieneEntregaEvaluada(proveedor: ISigDesempenoProveedor): boolean {
    return proveedor.entregasPuntuales + proveedor.entregasTardias > 0;
  }

  private limpiarResultados(): void {
    this.resumen = null;
    this.proveedores = [];
    this.pedidos = [];
    this.reportePedidos = null;
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudo cargar la analítica ' + 'de abastecimiento.';
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
      'No se pudo cargar la analítica ' +
      `de abastecimiento. HTTP ${error.status}.`
    );
  }
}
