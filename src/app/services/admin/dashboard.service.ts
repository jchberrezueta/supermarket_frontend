import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

export interface IDashboardStats {
  totalVentas: number;
  ventasHoy: number;
  totalProductos: number;
  totalClientes: number;
  totalEmpleados: number;
  totalProveedores: number;
  pedidosPendientes: number;
  entregasPendientes: number;
  ventasMes: number;
  productosStockBajo: number;
}

export interface IVentaMensual {
  mes: string;
  total: number;
}

export interface IProductoTop {
  nombre: string;
  cantidad: number;
}

export interface IVentaCategoria {
  categoria: string;
  total: number;
}

export interface IUltimaVenta {
  id: number;
  fecha: string;
  total: number;
  estado: string;
}

export interface IPedidoReciente {
  id: number;
  empresa: string;
  fecha: string;
  total: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'dashboard';

  public getEstadisticas(): Observable<IDashboardStats> {
    return this._restService.get<IDashboardStats>(`${this.apiUrl}/estadisticas`);
  }

  public getVentasMensuales(): Observable<IVentaMensual[]> {
    return this._restService.get<IVentaMensual[]>(`${this.apiUrl}/ventas-mensuales`);
  }

  public getProductosTop(): Observable<IProductoTop[]> {
    return this._restService.get<IProductoTop[]>(`${this.apiUrl}/productos-top`);
  }

  public getVentasPorCategoria(): Observable<IVentaCategoria[]> {
    return this._restService.get<IVentaCategoria[]>(`${this.apiUrl}/ventas-por-categoria`);
  }

  public getUltimasVentas(): Observable<IUltimaVenta[]> {
    return this._restService.get<IUltimaVenta[]>(`${this.apiUrl}/ultimas-ventas`);
  }

  public getPedidosRecientes(): Observable<IPedidoReciente[]> {
    return this._restService.get<IPedidoReciente[]>(`${this.apiUrl}/pedidos-recientes`);
  }
}
