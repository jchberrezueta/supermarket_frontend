import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IMarca, IMarcaResult } from '@models';
import { MarcasService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';
import { IResultDataCreate } from '../../../../../../core/models';

type MarcaFormGroup = FormGroupOf<IMarca>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _marcasService = inject(MarcasService);
  public location = inject(Location);

  protected formData!: MarcaFormGroup;
  private initialFormValue!: IMarca;

  protected isAdd = true;
  private idParam = -1;

  ngOnInit(): void {
    this.initForm();

    const idParam = this._route.snapshot.paramMap.get('id');

    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 0) {
      void Swal.fire(
        'Identificador inválido',
        'El identificador recibido no es válido.',
        'error',
      ).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;
    this.setData(id);
  }

  private initForm() {
    this.formData = this._fb.group({
      ideMarc: [{ value: -1, disabled: true }, Validators.required],
      nombreMarc: ['', Validators.required],
      paisOrigenMarc: ['', Validators.required],
      calidadMarc: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      descripcionMarc: [''],
    }) as MarcaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._marcasService.buscar(id).subscribe((res) => {
      const m = res.data[0] as IMarcaResult;
      this.formData.patchValue({
        ideMarc: m.ide_marc,
        nombreMarc: m.nombre_marc,
        paisOrigenMarc: m.pais_origen_marc,
        calidadMarc: m.calidad_marc,
        descripcionMarc: m.descripcion_marc,
      });
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire(
        'Formulario incompleto',
        'Revise los campos obligatorios.',
        'info',
      );

      return;
    }

    const raw = this.formData.getRawValue();

    const data: IMarca = {
      ...raw,

      nombreMarc: raw.nombreMarc.trim(),

      paisOrigenMarc: raw.paisOrigenMarc.trim(),

      calidadMarc: Number(raw.calidadMarc),

      descripcionMarc: raw.descripcionMarc?.trim() ?? '',
    };

    if (this.isAdd) {
      const { ideMarc: _ideMarc, ...createData } = data;

      this._marcasService.insertar(createData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Marca registrada');
        },

        error: (error) => {
          void Swal.fire(
            'No se pudo registrar',
            this.obtenerErrorHttp(error),
            'error',
          );
        },
      });

      return;
    }

    void Swal.fire({
      title: '¿Actualizar marca?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const updateData: IMarca = {
        ...data,
        ideMarc: this.idParam,
      };

      this._marcasService.actualizar(this.idParam, updateData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Marca actualizada');
        },

        error: (error) => {
          void Swal.fire(
            'No se pudo actualizar',
            this.obtenerErrorHttp(error),
            'error',
          );
        },
      });
    });
  }

  protected cancelar() {
    Swal.fire({
      title: '¿Cancelar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    }).then((r) => {
      if (r.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }

  private procesarRespuesta(
    response: IResultDataCreate,
    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensaje(
      response.p_response,

      success
        ? 'Operación completada correctamente.'
        : 'No se pudo completar la operación.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? successTitle : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success) {
        this.location.back();
      }
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
