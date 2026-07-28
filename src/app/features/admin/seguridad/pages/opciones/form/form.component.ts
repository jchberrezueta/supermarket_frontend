import { CommonModule, Location } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { IResultDataCreate } from '@core/models';

import { FormGroupOf } from '@core/utils/utilities';

import {
  EnumEstadosOpcion,
  ICreateOpcion,
  IOpcionForm,
  IOpcionResult,
  IUpdateOpcion,
  ListEstadosOpcion,
  ListVisibilidadOpcion,
} from '@models';

import { OpcionesService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type OpcionFormGroup = FormGroupOf<IOpcionForm>;

@Component({
  selector: 'app-form',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    UiComboBoxComponent,
  ],

  templateUrl: './form.component.html',

  styleUrl: './form.component.scss',
})
export default class FormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly opcionesService = inject(OpcionesService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected formData!: OpcionFormGroup;

  protected isAdd = true;

  protected readonly estadosOptions = ListEstadosOpcion;

  protected readonly visibilidadOptions = ListVisibilidadOpcion;

  protected opcionesPadre: IComboBoxOption[] = [];

  private idParam = -1;

  private initialFormValue!: IOpcionForm;

  ngOnInit(): void {
    this.initForm();

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id >= 0) {
      this.isAdd = false;
      this.idParam = id;
    }

    this.loadParentOptions();

    if (!this.isAdd) {
      this.setData(this.idParam);
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideOpci: [
        {
          value: -1,
          disabled: true,
        },
        [Validators.required],
      ],

      nombreOpci: ['', [Validators.required, Validators.maxLength(100)]],

      rutaOpci: ['', [Validators.required, Validators.maxLength(500)]],

      nivelOpci: [0, [Validators.required, Validators.min(0)]],

      padreOpci: [null],

      iconoOpci: ['', [Validators.maxLength(50)]],

      activoOpci: [EnumEstadosOpcion.SI, [Validators.required]],

      visibleOpci: [true, [Validators.required]],

      descripcionOpci: ['', [Validators.maxLength(250)]],
    }) as OpcionFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadParentOptions(): void {
    this.opcionesService.listar().subscribe({
      next: (response) => {
        const options = response.data
          .filter((option) => option.ide_opci !== this.idParam)
          .map(
            (option): IComboBoxOption => ({
              value: option.ide_opci,

              label: `${option.nombre_opci} — ${option.ruta_opci}`,
            }),
          );

        this.opcionesPadre = [
          {
            value: null,
            label: 'Sin opción padre',
          },
          ...options,
        ];
      },
    });
  }

  private setData(id: number): void {
    this.loadingService.show();

    this.opcionesService.buscar(id).subscribe({
      next: (response) => {
        const option = response.data[0] as IOpcionResult | undefined;

        if (!option) {
          this.loadingService.hide();

          void Swal.fire({
            icon: 'error',
            title: 'Opción no encontrada',
          }).then(() => this.location.back());

          return;
        }

        this.formData.patchValue({
          ideOpci: option.ide_opci,

          nombreOpci: option.nombre_opci,

          rutaOpci: option.ruta_opci,

          nivelOpci: option.nivel_opci,

          padreOpci: option.padre_opci,

          iconoOpci: option.icono_opci ?? '',

          activoOpci: option.activo_opci,

          visibleOpci: option.visible_opci,

          descripcionOpci: option.descripcion_opci ?? '',
        });

        this.loadingService.hide();
      },

      error: () => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',

          text: 'No fue posible consultar la opción.',
        });
      },
    });
  }

  protected guardar(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();

      void Swal.fire({
        icon: 'info',
        title: 'Faltan datos',

        text: 'Revisa la información ingresada.',
      });

      return;
    }

    if (Number(this.formData.controls.padreOpci.value) === this.idParam) {
      void Swal.fire({
        icon: 'warning',
        title: 'Jerarquía inválida',

        text: 'Una opción no puede ser su propio padre.',
      });

      return;
    }

    if (this.isAdd) {
      this.insertar();
      return;
    }

    void Swal.fire({
      title: '¿Actualizar opción?',

      text: 'Se guardarán los cambios realizados.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, actualizar',

      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizar();
      }
    });
  }

  private insertar(): void {
    const raw = this.formData.getRawValue();

    const body: ICreateOpcion = {
      nombreOpci: raw.nombreOpci.trim(),

      rutaOpci: raw.rutaOpci.trim(),

      activoOpci: raw.activoOpci,

      descripcionOpci: raw.descripcionOpci.trim() || null,

      nivelOpci: Number(raw.nivelOpci),

      padreOpci: this.normalizeParent(raw.padreOpci),

      iconoOpci: raw.iconoOpci.trim() || null,

      visibleOpci: Boolean(raw.visibleOpci),
    };

    this.loadingService.show();

    this.opcionesService.insertar(body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.processResponse(response, 'Opción registrada');
      },

      error: (error) => {
        this.loadingService.hide();

        this.showHttpError(error, 'No se pudo registrar la opción.');
      },
    });
  }

  private actualizar(): void {
    const raw = this.formData.getRawValue();

    const body: IUpdateOpcion = {
      ideOpci: this.idParam,

      nombreOpci: raw.nombreOpci.trim(),

      rutaOpci: raw.rutaOpci.trim(),

      activoOpci: raw.activoOpci,

      descripcionOpci: raw.descripcionOpci.trim() || null,

      nivelOpci: Number(raw.nivelOpci),

      padreOpci: this.normalizeParent(raw.padreOpci),

      iconoOpci: raw.iconoOpci.trim() || null,

      visibleOpci: Boolean(raw.visibleOpci),
    };

    this.loadingService.show();

    this.opcionesService.actualizar(this.idParam, body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.processResponse(response, 'Opción actualizada');
      },

      error: (error) => {
        this.loadingService.hide();

        this.showHttpError(error, 'No se pudo actualizar la opción.');
      },
    });
  }

  protected cancelar(): void {
    void Swal.fire({
      title: '¿Cancelar cambios?',

      text: 'Los cambios no guardados se perderán.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, cancelar',

      cancelButtonText: 'Continuar editando',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private normalizeParent(value: number | null): number | null {
    if (value === null || value === undefined || value === -1) {
      return null;
    }

    const numberValue = Number(value);

    return Number.isInteger(numberValue) ? numberValue : null;
  }

  private processResponse(
    response: IResultDataCreate,

    title: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.parseMessage(
      response.p_response,
      success
        ? 'Operación completada correctamente.'
        : 'La operación fue rechazada.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? title : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success) {
        this.location.back();
      }
    });
  }

  private showHttpError(error: any, fallback: string): void {
    const message = error?.error?.message;

    void Swal.fire({
      icon: 'error',
      title: 'Error de operación',

      text: Array.isArray(message)
        ? message.join('. ')
        : typeof message === 'string'
          ? message
          : fallback,
    });
  }

  private parseMessage(
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
}
