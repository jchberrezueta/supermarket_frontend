export interface ISigFiltrosAbastecimiento {
  estado?: string;
  limite?: number;
}

export interface ISigResumenAbastecimiento {
  pedidos: number;
  pedidosCompletados: number;
  pedidosPendientes: number;
  pedidosCancelados: number;

  cantidadSolicitada: number;
  cantidadRecibida: number;
  porcentajeCumplimiento: number;

  totalPedidos: number;

  entregas: number;
  entregasCompletas: number;
  entregasPendientes: number;
  entregasPuntuales: number;
  entregasTardias: number;
  porcentajePuntualidad: number;
}

export interface ISigDesempenoProveedor {
  idEmpresaOrigen: number;
  empresa: string;
  proveedores: number;

  pedidos: number;
  pedidosCompletados: number;
  pedidosPendientes: number;

  cantidadSolicitada: number;
  cantidadRecibida: number;
  porcentajeCumplimiento: number;

  entregas: number;
  entregasPuntuales: number;
  entregasTardias: number;
  porcentajePuntualidad: number;

  totalPedidos: number;
}

export interface ISigReporteProveedores {
  items: ISigDesempenoProveedor[];
  total: number;
  limite: number;
}

export interface ISigPedidoAbastecimiento {
  idPedidoOrigen: number;
  idEmpresaOrigen: number;
  empresa: string;
  motivo: string;
  estado: string;

  fechaPedido: string;
  fechaEsperada?: string;

  cantidadSolicitada: number;
  cantidadRecibida: number;
  porcentajeCumplimiento: number;

  total: number;
}

export interface ISigReportePedidosAbastecimiento {
  estado?: string;
  items: ISigPedidoAbastecimiento[];
  total: number;
  limite: number;
}
