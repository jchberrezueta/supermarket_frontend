import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { IResultDataMovimientoInventario } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovimientosInventarioService {
  private readonly restService = inject(RestService);
  private readonly apiUrl = 'movimientos-inventario';

  public listar(): Observable<IResultDataMovimientoInventario> {
    return this.restService.get<IResultDataMovimientoInventario>(this.apiUrl);
  }

  public listarComboProductos(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/productos`,
    );
  }

  public listarComboTipos(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/tipos`,
    );
  }
}
