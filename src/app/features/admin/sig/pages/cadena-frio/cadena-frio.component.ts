import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ISigAlertaIot,
  ISigApiResponse,
  ISigDetalleIncidenteIot,
  ISigEventoAuditoriaIot,
  ISigIncidenteIot,
  ISigLecturaIot,
  ISigResumenCadenaFrio,
  SigEstadoAlerta,
  SigEstadoIncidente,
} from '@models';
import { SigCadenaFrioService } from '@services/index';

import { finalize, forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-sig-cadena-frio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadena-frio.component.html',
  styleUrl: './cadena-frio.component.scss',
})
export default class CadenaFrioComponent implements OnInit {
  private readonly cadenaFrioService = inject(SigCadenaFrioService);

  protected readonly codigoDispositivo = 'ESP32-BODEGA-01';

  protected resumen: ISigResumenCadenaFrio | null = null;

  protected lecturas: ISigLecturaIot[] = [];

  protected alertas: ISigAlertaIot[] = [];

  protected incidentes: ISigIncidenteIot[] = [];

  protected auditoria: ISigEventoAuditoriaIot[] = [];

  protected detalleSeleccionado: ISigDetalleIncidenteIot | null = null;

  protected limite = 20;

  protected cargando = true;

  protected cargandoDetalle = false;

  protected procesando = false;

  protected mensajeError = '';

  protected mensajeOperacion = '';

  protected ultimaConsulta: Date | null = null;

  protected responsableReconocimiento = 'Gerente de bodega';

  protected accionDescripcion = '';

  protected accionResponsable = 'Técnico de mantenimiento';

  protected accionResultado = '';

  public ngOnInit(): void {
    this.cargarPanel();
  }

  protected cargarPanel(mostrarIndicador = true): void {
    const incidenteSeleccionadoId =
      this.detalleSeleccionado?.incidente.id ?? null;

    if (mostrarIndicador) {
      this.cargando = true;
    }

    this.mensajeError = '';

    forkJoin({
      resumen: this.cadenaFrioService.obtenerResumen(this.codigoDispositivo),

      lecturas: this.cadenaFrioService.obtenerLecturas(
        this.codigoDispositivo,
        this.limite,
      ),

      alertas: this.cadenaFrioService.obtenerAlertas(undefined, this.limite),

      incidentes: this.cadenaFrioService.obtenerIncidentes(
        undefined,
        this.limite,
      ),

      auditoria: this.cadenaFrioService.obtenerAuditoria(undefined, 50),
    })
      .pipe(
        finalize(() => {
          if (mostrarIndicador) {
            this.cargando = false;
          }
        }),
      )
      .subscribe({
        next: (response) => {
          const respuestaValida =
            response.resumen.success &&
            response.lecturas.success &&
            response.alertas.success &&
            response.incidentes.success &&
            response.auditoria.success;

          if (!respuestaValida) {
            this.mensajeError =
              'La API SIG no devolvió información válida de cadena de frío.';

            return;
          }

          this.resumen = response.resumen.data;

          this.lecturas = response.lecturas.data.items ?? [];

          this.alertas = response.alertas.data.items ?? [];

          this.incidentes = response.incidentes.data.items ?? [];

          this.auditoria = response.auditoria.data.items ?? [];

          this.ultimaConsulta = new Date();

          if (
            incidenteSeleccionadoId !== null &&
            this.incidentes.some(
              (incidente) => incidente.id === incidenteSeleccionadoId,
            )
          ) {
            this.cargarDetalle(incidenteSeleccionadoId, false);
          }
        },

        error: (error: unknown) => {
          this.mensajeError = this.obtenerMensajeError(error);
        },
      });
  }

  protected cargarDetalle(incidenteId: number, mostrarIndicador = true): void {
    if (mostrarIndicador) {
      this.cargandoDetalle = true;
    }

    this.mensajeOperacion = '';

    this.cadenaFrioService
      .obtenerDetalleIncidente(incidenteId)
      .pipe(
        finalize(() => {
          if (mostrarIndicador) {
            this.cargandoDetalle = false;
          }
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.mensajeOperacion =
              'No se pudo obtener el detalle del incidente.';

            return;
          }

          this.detalleSeleccionado = response.data;
        },

        error: (error: unknown) => {
          this.mensajeOperacion = this.obtenerMensajeError(error);
        },
      });
  }

  protected reconocerIncidente(): void {
    const incidente = this.detalleSeleccionado?.incidente;

    const responsable = this.responsableReconocimiento.trim();

    if (!incidente) {
      return;
    }

    if (responsable.length < 3) {
      this.mensajeOperacion =
        'El responsable debe tener al menos 3 caracteres.';

      return;
    }

    this.ejecutarOperacion(
      this.cadenaFrioService.reconocerIncidente(incidente.id, {
        responsable,
      }),
      'El incidente fue reconocido correctamente.',
    );
  }

  protected registrarAccionCorrectiva(): void {
    const incidente = this.detalleSeleccionado?.incidente;

    const descripcion = this.accionDescripcion.trim();

    const responsable = this.accionResponsable.trim();

    const resultado = this.accionResultado.trim();

    if (!incidente) {
      return;
    }

    if (descripcion.length < 10) {
      this.mensajeOperacion =
        'La acción correctiva debe tener al menos 10 caracteres.';

      return;
    }

    if (responsable.length < 3) {
      this.mensajeOperacion =
        'El responsable debe tener al menos 3 caracteres.';

      return;
    }

    this.ejecutarOperacion(
      this.cadenaFrioService.registrarAccionCorrectiva(incidente.id, {
        descripcion,
        responsable,
        resultado: resultado || undefined,
      }),
      'La acción correctiva fue registrada.',
      true,
    );
  }

  protected resolverIncidente(): void {
    const incidente = this.detalleSeleccionado?.incidente;

    if (!incidente) {
      return;
    }

    this.ejecutarOperacion(
      this.cadenaFrioService.resolverIncidente(incidente.id),
      'El incidente fue marcado como resuelto.',
    );
  }

  protected cerrarIncidente(): void {
    const incidente = this.detalleSeleccionado?.incidente;

    if (!incidente) {
      return;
    }

    this.ejecutarOperacion(
      this.cadenaFrioService.cerrarIncidente(incidente.id),
      'El incidente y su alerta fueron cerrados.',
    );
  }

  protected limpiarSeleccion(): void {
    this.detalleSeleccionado = null;
    this.mensajeOperacion = '';
  }

  protected puedeReconocer(): boolean {
    return this.detalleSeleccionado?.incidente.estado === 'abierto';
  }

  protected puedeRegistrarAccion(): boolean {
    const estado = this.detalleSeleccionado?.incidente.estado;

    return estado === 'reconocido' || estado === 'en_tratamiento';
  }

  protected puedeResolver(): boolean {
    return (
      this.detalleSeleccionado?.incidente.estado === 'en_tratamiento' &&
      (this.detalleSeleccionado?.acciones.length ?? 0) > 0
    );
  }

  protected puedeCerrar(): boolean {
    return this.detalleSeleccionado?.incidente.estado === 'resuelto';
  }

  protected alertasActivas(): number {
    if (!this.resumen) {
      return 0;
    }

    return this.resumen.alertas.abiertas + this.resumen.alertas.reconocidas;
  }

  protected incidentesActivos(): number {
    if (!this.resumen) {
      return 0;
    }

    return (
      this.resumen.incidentes.abiertos +
      this.resumen.incidentes.reconocidos +
      this.resumen.incidentes.enTratamiento +
      this.resumen.incidentes.resueltos
    );
  }

  protected formatearEstado(estado: string): string {
    const etiquetas: Record<string, string> = {
      normal: 'Normal',
      fuera_rango: 'Fuera de rango',
      abierta: 'Abierta',
      reconocida: 'Reconocida',
      cerrada: 'Cerrada',
      abierto: 'Abierto',
      reconocido: 'Reconocido',
      en_tratamiento: 'En tratamiento',
      resuelto: 'Resuelto',
      cerrado: 'Cerrado',
    };

    return etiquetas[estado] ?? estado;
  }

  protected claseEstado(estado: string): string {
    const clases: Record<string, string> = {
      normal: 'status_success',
      cerrado: 'status_success',
      cerrada: 'status_success',
      resuelto: 'status_info',
      reconocido: 'status_info',
      reconocida: 'status_info',
      en_tratamiento: 'status_warning',
      abierto: 'status_danger',
      abierta: 'status_danger',
      fuera_rango: 'status_danger',
    };

    return clases[estado] ?? 'status_neutral';
  }

  protected clasePrioridad(prioridad: string): string {
    const clases: Record<string, string> = {
      critica: 'priority_critical',
      alta: 'priority_high',
      media: 'priority_medium',
      baja: 'priority_low',
      informativa: 'priority_info',
    };

    return clases[prioridad] ?? 'priority_info';
  }

  protected pasoReconocido(): boolean {
    return Boolean(this.detalleSeleccionado?.incidente.fechaReconocimiento);
  }

  protected pasoEnTratamiento(): boolean {
    return (this.detalleSeleccionado?.acciones.length ?? 0) > 0;
  }

  protected pasoResuelto(): boolean {
    return Boolean(this.detalleSeleccionado?.incidente.fechaResolucion);
  }

  protected pasoCerrado(): boolean {
    return Boolean(this.detalleSeleccionado?.incidente.fechaCierre);
  }

  private ejecutarOperacion(
    operacion$: Observable<ISigApiResponse<ISigDetalleIncidenteIot>>,
    mensajeCorrecto: string,
    limpiarFormularioAccion = false,
  ): void {
    this.procesando = true;
    this.mensajeOperacion = '';

    operacion$
      .pipe(
        finalize(() => {
          this.procesando = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.mensajeOperacion = 'La operación BPM no pudo completarse.';

            return;
          }

          this.detalleSeleccionado = response.data;

          this.mensajeOperacion = mensajeCorrecto;

          if (limpiarFormularioAccion) {
            this.accionDescripcion = '';
            this.accionResultado = '';
          }

          this.cargarPanel(false);
        },

        error: (error: unknown) => {
          this.mensajeOperacion = this.obtenerMensajeError(error);
        },
      });
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No fue posible completar la operación ' + 'de cadena de frío.';
    }

    if (error.status === 0) {
      return (
        'No se pudo conectar con la API SIG. ' +
        'Comprueba que Go esté ejecutándose.'
      );
    }

    const respuesta = error.error as {
      error?:
        | string
        | {
            code?: string;
            message?: string;
          };

      message?: string;
    } | null;

    if (
      respuesta?.error &&
      typeof respuesta.error === 'object' &&
      respuesta.error.message
    ) {
      return respuesta.error.message;
    }

    if (typeof respuesta?.error === 'string') {
      return respuesta.error;
    }

    if (respuesta?.message) {
      return respuesta.message;
    }

    if (error.status === 401) {
      return 'La sesión administrativa no es válida ' + 'o ha expirado.';
    }

    if (error.status === 403) {
      return (
        'El perfil actual no tiene autorización ' +
        'para operar el proceso BPM.'
      );
    }

    return 'La operación no pudo completarse. ' + `HTTP ${error.status}.`;
  }
}
