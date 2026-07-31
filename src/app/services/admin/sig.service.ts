import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestService } from '@core/services/rest.service';
import { environment } from '@envs/environment';
import {
  ISigApiResponse,
  ISigFiltrosVentas,
  ISigRankingCategorias,
  ISigRankingProductos,
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
        params: this.crearParametros(filtros),
      },
    );
  }

  public obtenerTendenciaVentas(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigTendenciaVentas>> {
    return this.restService.get<ISigApiResponse<ISigTendenciaVentas>>(
      `${this.apiUrl}/ventas/tendencia`,
      {
        params: this.crearParametros(filtros),
      },
    );
  }

  public obtenerProductosMasVendidos(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigRankingProductos>> {
    return this.restService.get<ISigApiResponse<ISigRankingProductos>>(
      `${this.apiUrl}/ventas/productos`,
      {
        params: this.crearParametros(filtros, true),
      },
    );
  }

  public obtenerVentasPorCategoria(
    filtros: ISigFiltrosVentas = {},
  ): Observable<ISigApiResponse<ISigRankingCategorias>> {
    return this.restService.get<ISigApiResponse<ISigRankingCategorias>>(
      `${this.apiUrl}/ventas/categorias`,
      {
        params: this.crearParametros(filtros, true),
      },
    );
  }

  private crearParametros(
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
}
