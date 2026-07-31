import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestService } from '@core/services/rest.service';
import { environment } from '@envs/environment';
import {
  ISigApiResponse,
  ISigFiltrosInventario,
  ISigFiltrosVentas,
  ISigInventarioResumen,
  ISigRankingCategorias,
  ISigRankingProductos,
  ISigReporteCaducidad,
  ISigReporteMovimientosInventario,
  ISigReporteStockCritico,
  ISigResumenEjecutivo,
  ISigResumenVentasPeriodo,
  ISigTendenciaVentas,
} from '@models';

@Injectable({
  providedIn: 'root',
})
export class SigService {
  private readonly restService = inject(RestService);
  private readonly apiUrl = environment.sig_api_url;

  public obtenerResumenEjecutivo(): Observable<
    ISigApiResponse<ISigResumenEjecutivo>
  > {
    return this.restService.get<ISigApiResponse<ISigResumenEjecutivo>>(
      `${this.apiUrl}/resumen-ejecutivo`,
    );
  }

  public obtenerResumenVentas(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigResumenVentasPeriodo>> {
    return this.restService.get<ISigApiResponse<ISigResumenVentasPeriodo>>(
      `${this.apiUrl}/ventas/resumen`,
      {
        params: this.crearParametrosVentas(filtros),
      },
    );
  }

  public obtenerTendenciaVentas(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigTendenciaVentas>> {
    return this.restService.get<ISigApiResponse<ISigTendenciaVentas>>(
      `${this.apiUrl}/ventas/tendencia`,
      {
        params: this.crearParametrosVentas(filtros),
      },
    );
  }

  public obtenerProductosMasVendidos(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigRankingProductos>> {
    return this.restService.get<ISigApiResponse<ISigRankingProductos>>(
      `${this.apiUrl}/ventas/productos`,
      {
        params: this.crearParametrosVentas(filtros, true),
      },
    );
  }

  public obtenerVentasPorCategoria(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigRankingCategorias>> {
    return this.restService.get<ISigApiResponse<ISigRankingCategorias>>(
      `${this.apiUrl}/ventas/categorias`,
      {
        params: this.crearParametrosVentas(filtros, true),
      },
    );
  }

  public obtenerResumenInventario(
    dias = 30,
  ): Observable<ISigApiResponse<ISigInventarioResumen>> {
    return this.restService.get<ISigApiResponse<ISigInventarioResumen>>(
      `${this.apiUrl}/inventario/resumen`,
      {
        params: new HttpParams().set('dias', dias.toString()),
      },
    );
  }

  public obtenerStockCritico(
    limite = 20,
  ): Observable<ISigApiResponse<ISigReporteStockCritico>> {
    return this.restService.get<ISigApiResponse<ISigReporteStockCritico>>(
      `${this.apiUrl}/inventario/stock-critico`,
      {
        params: new HttpParams().set('limite', limite.toString()),
      },
    );
  }

  public obtenerCaducidadInventario(
    dias = 30,
    limite = 20,
  ): Observable<ISigApiResponse<ISigReporteCaducidad>> {
    const params = new HttpParams()
      .set('dias', dias.toString())
      .set('limite', limite.toString());

    return this.restService.get<ISigApiResponse<ISigReporteCaducidad>>(
      `${this.apiUrl}/inventario/caducidad`,
      {
        params,
      },
    );
  }

  public obtenerMovimientosInventario(
    filtros: ISigFiltrosInventario = {},
  ): Observable<ISigApiResponse<ISigReporteMovimientosInventario>> {
    return this.restService.get<
      ISigApiResponse<ISigReporteMovimientosInventario>
    >(`${this.apiUrl}/inventario/movimientos`, {
      params: this.crearParametrosMovimientosInventario(filtros),
    });
  }

  private crearParametrosVentas(
    filtros: ISigFiltrosVentas,
    incluirLimite = false,
  ): HttpParams {
    let params = new HttpParams();

    if (filtros.desde) {
      params = params.set('desde', filtros.desde);
    }

    if (filtros.hasta) {
      params = params.set('hasta', filtros.hasta);
    }

    if (incluirLimite && filtros.limite !== undefined) {
      params = params.set('limite', filtros.limite.toString());
    }

    return params;
  }

  private crearParametrosMovimientosInventario(
    filtros: ISigFiltrosInventario,
  ): HttpParams {
    let params = new HttpParams();

    if (filtros.desde) {
      params = params.set('desde', filtros.desde);
    }

    if (filtros.hasta) {
      params = params.set('hasta', filtros.hasta);
    }

    if (filtros.tipo) {
      params = params.set('tipo', filtros.tipo);
    }

    if (filtros.limite !== undefined) {
      params = params.set('limite', filtros.limite.toString());
    }

    return params;
  }
}
