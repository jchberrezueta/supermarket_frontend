import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroupOf } from '@core/utils/utilities';
import { VentasService } from '@services/ventas.service';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTableListComponent } from '@shared/components/index';
import { TableRow } from '@shared/models/button_item.model';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ListVentasConfig } from './list_ventas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiCardComponent,
  ReactiveFormsModule,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiDatetimePickerComponent,
];

interface IFiltroVentaForm {
  numFacturaVent: string;
  estadoVent: string;
  fechaVentDesde: string;
  fechaVentHasta: string;
}

type FilterVentaFormGroup = FormGroupOf<IFiltroVentaForm>;

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
  private readonly _ventasService = inject(VentasService);
  private readonly router = inject(Router);
  private readonly formBuilder = new FormBuilder();

  protected readonly config = ListVentasConfig;

  protected opcionesEstado: IComboBoxOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Completado', value: 'completado' },
    { label: 'Cancelado', value: 'cancelado' },
    { label: 'Devuelto', value: 'devuelto' },
  ];

  protected formData!: FilterVentaFormGroup;

  private initialFormValue!: IFiltroVentaForm;
  private ejecutandoAccion = false;

  constructor() {
    this.configForm();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      numFacturaVent: ['', [], []],
      estadoVent: ['', [], []],
      fechaVentDesde: ['', [], []],
      fechaVentHasta: ['', [], []],
    }) as FilterVentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  protected filtrar(): void {
    this._tableList().filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    this._tableList().refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  protected manejarAccion(event: { action: string; row: TableRow }): void {
    const id = Number(event.row['ide_vent']);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    if (event.action === 'details') {
      void this.router.navigate(['/admin/ventas/ventas/details', id]);
      return;
    }

    if (
      event.action === 'cancel' &&
      event.row['estado_vent'] === 'completado'
    ) {
      this.solicitarCancelacion(id);
    }
  }

  private solicitarCancelacion(id: number): void {
    if (this.ejecutandoAccion) {
      return;
    }

    void Swal.fire({
      icon: 'warning',
      title: 'Anular venta',
      text:
        'Se restaurarán el stock general y los lotes exactos consumidos por FEFO.',
      input: 'textarea',
      inputLabel: 'Motivo de anulación',
      inputPlaceholder: 'Escriba un motivo de 5 a 250 caracteres.',
      inputAttributes: {
        maxlength: '250',
        'aria-label': 'Motivo de anulación de la venta',
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, anular venta',
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

      this.cancelarVenta(id, String(result.value ?? '').trim());
    });
  }

  private cancelarVenta(id: number, motivo: string): void {
    this.ejecutandoAccion = true;

    this._ventasService
      .cancelar(id, motivo)
      .pipe(finalize(() => (this.ejecutandoAccion = false)))
      .subscribe({
        next: (response) => {
          const success = Number(response.p_result) === 1;

          void Swal.fire({
            icon: success ? 'success' : 'error',
            title: success ? 'Venta anulada' : 'Operación rechazada',
            text: this.mensajeRespuesta(
              response.p_response,
              success
                ? 'La venta y sus movimientos fueron revertidos.'
                : 'No se pudo anular la venta.',
            ),
          });

          if (success) {
            this._tableList().refreshData();
          }
        },
        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo anular la venta',
            text:
              error?.error?.message ??
              error?.message ??
              'Ocurrió un error inesperado.',
          });
        },
      });
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroVentaForm;

    this.appendParam(params, 'numFacturaVent', filtro.numFacturaVent);
    this.appendParam(params, 'estadoVent', filtro.estadoVent);
    this.appendParam(params, 'fechaDesde', filtro.fechaVentDesde);
    this.appendParam(params, 'fechaHasta', filtro.fechaVentHasta);

    return params;
  }

  private appendParam(
    params: URLSearchParams,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined) {
      return;
    }

    const stringValue = String(value).trim();

    if (stringValue !== '') {
      params.append(key, stringValue);
    }
  }

  private mensajeRespuesta(response: string | undefined, fallback: string): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as { message?: string };
      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }
}
