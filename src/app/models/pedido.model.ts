import {
  IDetallePedido,
  ILoteDevolucionPedidoPayload,
} from './detalle_pedido.model';

export enum EnumEstadosPedido {
  BORRADOR = 'borrador',
  EMITIDO = 'emitido',
  PARCIAL = 'parcial',
  COMPLETADO = 'completado',
  CERRADO_INCOMPLETO = 'cerrado_incompleto',
  CANCELADO = 'cancelado',
}

export enum EnumMotivosPedido {
  PETICION = 'peticion',
  DEVOLUCION = 'devolucion',
}

export interface IPedido {
  idePedi: number;
  ideEmpr: number;
  fechaPedi: string;
  fechaEntrPedi: string | null;
  cantidadTotalPedi: number;
  totalPedi: number;
  estadoPedi: EnumEstadosPedido;
  motivoPedi: EnumMotivosPedido;
  observacionPedi: string | null;
}

export interface IPedidoResult {
  ide_pedi: number;
  ide_empr: number;
  fecha_pedi: string;
  fecha_entr_pedi: string | null;
  cantidad_total_pedi: number;
  total_pedi: number;
  estado_pedi: EnumEstadosPedido;
  motivo_pedi: EnumMotivosPedido;
  observacion_pedi: string | null;
}

export interface IResultDataPedido {
  data: IPedidoResult[];
  response: string;
}

export interface IFiltroPedido {
  nombreEmpr: string;
  estadoPedi: string;
  motivoPedi: EnumMotivosPedido;
  fechaPediDesde: string;
  fechaPediHasta: string;
}

export interface IPedidoCompleto {
  cabeceraPedido: {
    idePedi?: number;
    ideEmpr: number;
    motivoPedi: EnumMotivosPedido;
    fechaEntrPedi: string;
    observacionPedi?: string | null;
  };
  detallePedido: Array<
    Pick<IDetallePedido, 'ideProd' | 'cantidadProd'> & {
      lotesDevolucion: ILoteDevolucionPedidoPayload[];
    }
  >;
}
