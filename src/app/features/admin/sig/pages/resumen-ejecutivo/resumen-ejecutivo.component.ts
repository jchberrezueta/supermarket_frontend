import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  ISigResumenEjecutivo,
  SigPrioridadRecomendacion,
} from '@models';
import { SigService } from '@services/index';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-resumen-ejecutivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-ejecutivo.component.html',
  styleUrl: './resumen-ejecutivo.component.scss',
})
export default class ResumenEjecutivoComponent implements OnInit {
  private readonly sigService = inject(SigService);

  protected resumen: ISigResumenEjecutivo | null = null;
  protected cargando = true;
  protected mensajeError = '';
  protected ultimaConsulta: Date | null = null;

  ngOnInit(): void {
    this.cargarResumen();
  }

  protected cargarResumen(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.sigService
      .obtenerResumenEjecutivo()
      .pipe(
        finalize(() => {
          this.cargando = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response.success || !response.data) {
            this.resumen = null;
            this.mensajeError =
              'La API SIG no devolvió un resumen ejecutivo válido.';
            return;
          }

          this.resumen = response.data;
          this.ultimaConsulta = new Date();
        },
        error: (error: unknown) => {
          this.resumen = null;
          this.mensajeError = this.obtenerMensajeError(error);
        },
      });
  }

  protected etiquetaPrioridad(
    prioridad: SigPrioridadRecomendacion,
  ): string {
    switch (prioridad) {
      case 'critica':
        return 'Crítica';
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      case 'informativa':
        return 'Informativa';
      default:
        return prioridad;
    }
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudo cargar el resumen ejecutivo.';
    }

    if (error.status === 0) {
      return (
        'No se pudo conectar con la API SIG. ' +
        'Comprueba que Go esté ejecutándose en el puerto 8080.'
      );
    }

    const detalle =
      error.error as
        | {
            error?: string;
            message?: string;
          }
        | null;

    if (detalle?.error) {
      return detalle.error;
    }

    if (detalle?.message) {
      return detalle.message;
    }

    return `No se pudo cargar el resumen ejecutivo. HTTP ${error.status}.`;
  }
}
