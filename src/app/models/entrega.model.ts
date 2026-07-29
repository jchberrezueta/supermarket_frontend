import { IDetalleEntrega, IDetalleEntregaResult, ILineaPedidoPendiente } from './detalle_entrega.model';

export enum EnumEstadoEntrega {
  BORRADOR = 'borrador',
  PARCIAL = 'parcial',
  COMPLETA = 'completa',
  ANULADA = 'anulada',
}

export interface IEntregaCabeceraPayload {
  idePedi: number;
  ideProv: number;
  fechaEntr: string;
  observacionEntr?: string | null;
}

export interface IEntregaCompleta {
  cabeceraEntrega: IEntregaCabeceraPayload;
  detalleEntrega: IDetalleEntrega[];
}

export interface IEntregaResult {
  ide_entr: number;
  ide_pedi: number;
  ide_prov: number;
  nombre_proveedor?: string | null;
  ide_empr?: number | null;
  nombre_empr?: string | null;
  fecha_pedi?: string | null;
  fecha_entr_pedi?: string | null;
  fecha_entr: string;
  cantidad_total_entr: number;
  total_entr: number;
  estado_entr: EnumEstadoEntrega;
  observacion_entr: string | null;
  detalles?: IDetalleEntregaResult[];
}

export interface IResultDataEntrega { data: IEntregaResult[]; response: string; }

export interface IPedidoEntregaDisponible {
  ide_pedi: number;
  label: string;
  ide_empr: number;
  nombre_empr: string | null;
  responsable_empr: string | null;
  fecha_pedi: string;
  fecha_entr_pedi: string | null;
  estado_pedi: string;
  motivo_pedi: string;
}

export interface IPedidoEntregaPendiente {
  idePedi: number;
  ideEmpr: number;
  nombreEmpr: string | null;
  responsableEmpr: string | null;
  fechaPedi: string;
  fechaEntrPedi: string | null;
  estadoPedi: string;
  motivoPedi: string;
  detalles: ILineaPedidoPendiente[];
}

export interface IFiltroEntrega {
  idePedi: string;
  ideProv: string;
  estadoEntr: EnumEstadoEntrega | '';
  fechaEntrDesde: string;
  fechaEntrHasta: string;
}
