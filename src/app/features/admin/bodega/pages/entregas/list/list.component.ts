import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiTableListComponent } from '@shared/components/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { isValidStringValue, FormGroupOf } from '@core/utils/utilities';
import { IFiltroEmpresa, IFiltroEntrega } from 'app/models';
import { ListEntregasConfig } from './list_entregas.config';
import {
  EmpresasService,
  EntregasService,
  ProveedoresService,
} from '@services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { TableRow } from '@shared/models/button_item.model';

import { finalize } from 'rxjs';

import Swal from 'sweetalert2';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiInputBoxComponent,
  UiDatetimePickerComponent,
];

type filterEntregaFormGroup = FormGroupOf<IFiltroEntrega>;

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
  protected readonly config = ListEntregasConfig;
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _entregasService = inject(EntregasService);
  private formBuilder = inject(FormBuilder);
  protected opcionesProveedores!: IComboBoxOption[];
  protected opcionesProvEstados!: IComboBoxOption[];
  protected formData!: filterEntregaFormGroup;
  private initialFormValue!: IFiltroEntrega;
  private ejecutandoAccion = false;

  constructor() {
    this.loadComboProveedores();
    this.loadComboEstados();
    this.configForm();
  }

  protected configForm() {
    this.formData = this.formBuilder.group({
      idePedi: ['', [], []],
      ideProv: ['', [], []],
      estadoEntr: ['', [], []],
      fechaEntrDesde: ['', [], []],
      fechaEntrHasta: ['', [], []],
    }) as filterEntregaFormGroup;
    //snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboProveedores() {
    this._proveedoresService.listarComboProveedores().subscribe((res) => {
      this.opcionesProveedores = res;
    });
  }
  private loadComboEstados() {
    this._entregasService.listarComboEstados().subscribe((res) => {
      this.opcionesProvEstados = res;
    });
  }

  protected filtrar() {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEntrega;
    if (isValidStringValue(filtro.idePedi))
      params.append('idePedi', filtro.idePedi);
    if (isValidStringValue(filtro.ideProv))
      params.append('ideProv', filtro.ideProv);
    if (isValidStringValue(filtro.estadoEntr))
      params.append('estadoEntr', filtro.estadoEntr);
    if (isValidStringValue(filtro.fechaEntrDesde))
      params.append('fechaEntrDesde', filtro.fechaEntrDesde);
    if (isValidStringValue(filtro.fechaEntrHasta))
      params.append('fechaEntrHasta', filtro.fechaEntrHasta);
    return params;
  }

  protected refreshData(actionClick: string) {
    if (actionClick === 'refresh') {
      const tableListInstance = this._tableList();
      tableListInstance.refreshData();
      this.resetForm();
    }
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }

  protected manejarAccion(event: { action: string; row: TableRow }): void {
    if (this.ejecutandoAccion) {
      return;
    }

    const id = Number(event.row['ide_entr']);

    const estado = String(event.row['estado_entr'] ?? '');

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'error',
        title: 'Identificador inválido',
        text: 'No fue posible identificar la entrega.',
      });

      return;
    }

    if (event.action === 'confirm' && estado === 'borrador') {
      void Swal.fire({
        icon: 'warning',
        title: '¿Confirmar entrega?',
        text: 'La entrega afectará el stock, creará los lotes y ya no podrá editarse.',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Volver',
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmarEntrega(id);
        }
      });

      return;
    }

    if (
      event.action === 'annul' &&
      (estado === 'parcial' || estado === 'completa')
    ) {
      this.solicitarAnulacion(id);
    }
  }

  private anularEntrega(id: number, motivoAnulacion: string): void {
    if (this.ejecutandoAccion) {
      return;
    }

    this.ejecutandoAccion = true;

    this._entregasService
      .anular(id, motivoAnulacion)
      .pipe(
        finalize(() => {
          this.ejecutandoAccion = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const success = Number(response.p_result) === 1;

          void Swal.fire({
            icon: success ? 'success' : 'error',

            title: success ? 'Entrega anulada' : 'Operación rechazada',

            text: this.obtenerMensaje(
              response.p_response,

              success
                ? 'La entrega y sus movimientos fueron revertidos.'
                : 'No se pudo anular la entrega.',
            ),
          }).then(() => {
            if (success) {
              this._tableList().refreshData();
            }
          });
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo anular',

            text: this.obtenerErrorHttp(error),
          });
        },
      });
  }

  private solicitarAnulacion(id: number): void {
    void Swal.fire({
      icon: 'warning',

      title: 'Anular entrega',

      text: 'Se revertirá el stock ingresado, los lotes y el estado del pedido.',

      input: 'textarea',

      inputLabel: 'Motivo de anulación',

      inputPlaceholder: 'Escriba el motivo de la anulación.',

      inputAttributes: {
        maxlength: '250',
        'aria-label': 'Motivo de anulación',
      },

      showCancelButton: true,

      confirmButtonText: 'Sí, anular entrega',

      cancelButtonText: 'Volver',

      inputValidator: (value) => {
        const motivo = String(value ?? '').trim();

        if (motivo.length < 5) {
          return 'El motivo debe tener al menos 5 caracteres.';
        }

        if (motivo.length > 250) {
          return 'El motivo no puede superar 250 caracteres.';
        }

        return undefined;
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const motivo = String(result.value ?? '').trim();

      this.anularEntrega(id, motivo);
    });
  }

  private confirmarEntrega(id: number): void {
    this.ejecutandoAccion = true;

    this._entregasService
      .confirmar(id)
      .pipe(
        finalize(() => {
          this.ejecutandoAccion = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const success = Number(response.p_result) === 1;

          void Swal.fire({
            icon: success ? 'success' : 'error',

            title: success ? 'Entrega confirmada' : 'Operación rechazada',

            text: this.obtenerMensaje(
              response.p_response,

              success
                ? 'La entrega fue confirmada correctamente.'
                : 'No se pudo confirmar la entrega.',
            ),
          }).then(() => {
            if (success) {
              this._tableList().refreshData();
            }
          });
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',

            title: 'No se pudo confirmar',

            text: this.obtenerErrorHttp(error),
          });
        },
      });
  }

  private obtenerMensaje(
    response: string | undefined,

    fallback: string,
  ): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as {
        message?: string;
      };

      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }

  private obtenerErrorHttp(error: unknown): string {
    const httpError = error as {
      error?: {
        message?: string | string[];
      };

      message?: string;
    };

    const message = httpError.error?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message ?? httpError.message ?? 'Ocurrió un error inesperado.';
  }
}
