import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroPedido } from 'app/models';
import { ListPedidoConfig } from './list_pedidos.config';
import { EmpresasService, PedidosService } from '@services/index';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { Router } from '@angular/router';
import { TableRow } from '@shared/models/button_item.model';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiDatetimePickerComponent,
];

type FilterPedidoFormGroup = FormGroupOf<IFiltroPedido>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  private readonly _tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly _empresasService = inject(EmpresasService);
  private readonly _pedidosService = inject(PedidosService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private ejecutandoAccion = false;

  protected readonly config = ListPedidoConfig;

  protected opcionesEmpresas: IComboBoxOption[] = [];
  protected opcionesEstadosPedi: IComboBoxOption[] = [];
  protected opcionesMotivosPedi: IComboBoxOption[] = [];

  protected formData!: FilterPedidoFormGroup;

  private initialFormValue!: IFiltroPedido;

  constructor() {
    this.configForm();
    this.loadEmpresas();
    this.loadComboEstados();
    this.loadComboMotivos();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreEmpr: ['', [], []],
      estadoPedi: ['', [], []],
      motivoPedi: ['', [], []],
      fechaPediDesde: ['', [], []],
      fechaPediHasta: ['', [], []],
    }) as FilterPedidoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEmpresas(): void {
    this._empresasService.listarComboEmpresas().subscribe((res) => {
      this.opcionesEmpresas = res ?? [];
    });
  }

  private loadComboEstados(): void {
    this._pedidosService.listarComboEstados().subscribe((res) => {
      this.opcionesEstadosPedi = res ?? [];
    });
  }

  private loadComboMotivos(): void {
    this._pedidosService.listarComboMotivos().subscribe((res) => {
      this.opcionesMotivosPedi = res ?? [];
    });
  }

  protected filtrar(): void {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    const tableListInstance = this._tableList();
    tableListInstance.refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  protected manejarAccion(event: { action: string; row: TableRow }): void {
    const id = Number(event.row['ide_pedi']);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    const estado = String(event.row['estado_pedi']);

    if (event.action === 'view') {
      void this.router.navigate(['/admin/bodega/pedidos/details', id]);

      return;
    }

    if (event.action === 'edit' && estado === 'borrador') {
      void this.router.navigate(['/admin/bodega/pedidos/update', id]);

      return;
    }

    if (event.action === 'delete' && estado === 'borrador') {
      this.confirmarAccion(
        id,
        'Eliminar borrador',
        'El borrador se eliminará de forma permanente.',
        'delete',
      );

      return;
    }

    if (event.action === 'emit' && estado === 'borrador') {
      this.confirmarAccion(
        id,
        'Emitir pedido',
        'Después de emitirlo ya no podrá editarse como borrador.',
        'emit',
      );

      return;
    }

    if (
      event.action === 'cancel' &&
      (estado === 'borrador' || estado === 'emitido')
    ) {
      this.solicitarMotivo(id, 'cancel');

      return;
    }

    if (event.action === 'close-incomplete' && estado === 'parcial') {
      this.solicitarMotivo(id, 'close-incomplete');
    }
  }

  private confirmarAccion(
    id: number,
    title: string,
    text: string,
    action: 'delete' | 'emit',
  ): void {
    if (this.ejecutandoAccion) return;
    void Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: action === 'emit' ? 'Sí, emitir' : 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) this.ejecutarAccion(id, action);
    });
  }

  private ejecutarAccion(id: number, action: 'delete' | 'emit'): void {
    if (this.ejecutandoAccion) return;
    this.ejecutandoAccion = true;
    const request =
      action === 'emit'
        ? this._pedidosService.emitir(id)
        : this._pedidosService.eliminar(id);
    request.pipe(finalize(() => (this.ejecutandoAccion = false))).subscribe({
      next: (res) => {
        const success = Number(res?.p_result) === 1;
        const message = this.mensajeRespuesta(
          res?.p_response,
          success
            ? 'Operación completada.'
            : 'No se pudo completar la operación.',
        );
        void Swal.fire({
          icon: success ? 'success' : 'error',
          title: success
            ? action === 'emit'
              ? 'Pedido emitido'
              : 'Borrador eliminado'
            : 'Operación rechazada',
          text: message,
        });
        if (success) this._tableList().refreshData();
      },
      error: (error) =>
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo completar la operación',
          text:
            error?.error?.message ??
            'Revise el estado del pedido e intente nuevamente.',
        }),
    });
  }

  private solicitarMotivo(
    id: number,
    action: 'cancel' | 'close-incomplete',
  ): void {
    if (this.ejecutandoAccion) {
      return;
    }

    const esCancelacion = action === 'cancel';

    void Swal.fire({
      title: esCancelacion ? 'Cancelar pedido' : 'Cerrar pedido incompleto',

      text: esCancelacion
        ? 'El pedido conservará su historial, pero ya no podrá procesarse.'
        : 'Las cantidades pendientes se marcarán como no entregadas.',

      input: 'textarea',

      inputLabel: esCancelacion
        ? 'Motivo de cancelación'
        : 'Motivo del cierre incompleto',

      inputPlaceholder: 'Escriba un motivo de 5 a 250 caracteres.',

      inputAttributes: {
        maxlength: '250',
        'aria-label': 'Motivo de la operación',
      },

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: esCancelacion
        ? 'Sí, cancelar pedido'
        : 'Sí, cerrar incompleto',

      cancelButtonText: 'Volver',

      inputValidator: (value) => {
        const motivo = String(value ?? '').trim();

        if (motivo.length < 5) {
          return 'El motivo debe tener al menos ' + '5 caracteres.';
        }

        if (motivo.length > 250) {
          return 'El motivo no puede superar ' + '250 caracteres.';
        }

        return undefined;
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const motivo = String(result.value ?? '').trim();

      this.ejecutarAccionConMotivo(id, action, motivo);
    });
  }

  private ejecutarAccionConMotivo(
    id: number,
    action: 'cancel' | 'close-incomplete',
    motivo: string,
  ): void {
    if (this.ejecutandoAccion) {
      return;
    }

    this.ejecutandoAccion = true;

    const request =
      action === 'cancel'
        ? this._pedidosService.cancelar(id, motivo)
        : this._pedidosService.cerrarIncompleto(id, motivo);

    request
      .pipe(
        finalize(() => {
          this.ejecutandoAccion = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const success = Number(response.p_result) === 1;

          const message = this.mensajeRespuesta(
            response.p_response,

            success
              ? 'Operación completada correctamente.'
              : 'No se pudo completar la operación.',
          );

          void Swal.fire({
            icon: success ? 'success' : 'error',

            title: success
              ? action === 'cancel'
                ? 'Pedido cancelado'
                : 'Pedido cerrado'
              : 'Operación rechazada',

            text: message,
          });

          if (success) {
            this._tableList().refreshData();
          }
        },

        error: (error) => {
          const message = error?.error?.message;

          void Swal.fire({
            icon: 'error',
            title: 'No se pudo completar la operación',

            text: Array.isArray(message)
              ? message.join(' ')
              : (message ?? 'Revise el estado del pedido.'),
          });
        },
      });
  }

  private mensajeRespuesta(
    response: string | undefined,
    fallback: string,
  ): string {
    if (!response) return fallback;
    try {
      return JSON.parse(response).message ?? fallback;
    } catch {
      return response;
    }
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroPedido;

    if (isValidStringValue(filtro.nombreEmpr)) {
      params.append('nombreEmpr', filtro.nombreEmpr);
    }

    if (isValidStringValue(filtro.estadoPedi)) {
      params.append('estadoPedi', filtro.estadoPedi);
    }

    if (isValidStringValue(filtro.motivoPedi)) {
      params.append('motivoPedi', filtro.motivoPedi);
    }

    if (isValidStringValue(filtro.fechaPediDesde)) {
      params.append('fechaPediDesde', filtro.fechaPediDesde);
    }

    if (isValidStringValue(filtro.fechaPediHasta)) {
      params.append('fechaPediHasta', filtro.fechaPediHasta);
    }

    return params;
  }
}
