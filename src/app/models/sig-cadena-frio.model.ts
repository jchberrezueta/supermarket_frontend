export type SigEstadoLecturaIot = 'normal' | 'fuera_rango';

export type SigSeveridadIot = 'media' | 'alta' | 'critica';

export type SigEstadoAlerta = 'abierta' | 'reconocida' | 'cerrada';

export type SigEstadoIncidente =
  | 'abierto'
  | 'reconocido'
  | 'en_tratamiento'
  | 'resuelto'
  | 'cerrado';

export type SigPrioridadCadenaFrio =
  | 'critica'
  | 'alta'
  | 'media'
  | 'baja'
  | 'informativa';

export interface ISigLecturaIot {
  id: number;
  codigoDispositivo: string;
  temperatura: number;
  humedad?: number;
  estado: SigEstadoLecturaIot;
  fechaLectura: string;
  fechaRegistro: string;
}

export interface ISigAlertaIot {
  id: number;
  idLectura: number;
  tipo: string;
  severidad: SigSeveridadIot;
  mensaje: string;
  estado: SigEstadoAlerta;
  fechaApertura: string;
  fechaReconocimiento?: string;
  fechaCierre?: string;
}

export interface ISigIncidenteIot {
  id: number;
  idAlerta: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  severidad: SigSeveridadIot;
  estado: SigEstadoIncidente;
  responsable?: string;
  fechaApertura: string;
  fechaReconocimiento?: string;
  fechaResolucion?: string;
  fechaCierre?: string;
}

export interface ISigAccionCorrectivaIot {
  id: number;
  idIncidente: number;
  descripcion: string;
  responsable: string;
  resultado?: string;
  fechaAccion: string;
}

export interface ISigDetalleIncidenteIot {
  incidente: ISigIncidenteIot;
  alerta: ISigAlertaIot;
  acciones: ISigAccionCorrectivaIot[];
}

export interface ISigConteoAlertasIot {
  abiertas: number;
  reconocidas: number;
  cerradas: number;
}

export interface ISigConteoIncidentesIot {
  abiertos: number;
  reconocidos: number;
  enTratamiento: number;
  resueltos: number;
  cerrados: number;
}

export interface ISigRecomendacionCadenaFrio {
  codigo: string;
  prioridad: SigPrioridadCadenaFrio;
  titulo: string;
  mensaje: string;
}

export interface ISigResumenCadenaFrio {
  codigoDispositivo: string;
  ultimaLectura?: ISigLecturaIot;
  totalLecturas: number;
  lecturasNormales: number;
  lecturasFueraRango: number;
  porcentajeNormal: number;
  alertas: ISigConteoAlertasIot;
  incidentes: ISigConteoIncidentesIot;
  recomendaciones: ISigRecomendacionCadenaFrio[];
  fechaActualizacion: string;
}

export interface ISigEventoAuditoriaIot {
  id: number;
  actor: string;
  accion: string;
  modulo: string;
  entidad: string;
  idRegistro: string;
  resultado: string;
  detalle?: string;
  fechaEvento: string;
}

export interface ISigListaIot<T> {
  items: T[];
  total: number;
  limite: number;
}

export interface ISigReconocerIncidenteRequest {
  responsable: string;
}

export interface ISigAccionCorrectivaRequest {
  descripcion: string;
  responsable: string;
  resultado?: string;
}
