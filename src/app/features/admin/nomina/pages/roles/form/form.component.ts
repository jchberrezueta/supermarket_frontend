import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { IResultDataCreate } from '@core/models';

import { FormGroupOf } from '@core/utils/utilities';

import { IRol, IRolResult } from '@models';

import { RolesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';

type RolFormGroup = FormGroupOf<IRol>;

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
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly rolesService = inject(RolesService);

  public readonly location = inject(Location);

  protected formData!: RolFormGroup;

  private initialFormValue!: IRol;

  protected isAdd = true;

  private idParam = -1;

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    /*
     * La ruta de creación no tiene ID.
     */
    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 0) {
      void Swal.fire({
        icon: 'error',
        title: 'Identificador inválido',
        text: 'El identificador del rol no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;

    this.setData(id);
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideRol: [
        {
          value: -1,
          disabled: true,
        },
        Validators.required,
      ],

      nombreRol: ['', [Validators.required, Validators.maxLength(100)]],

      descripcionRol: ['', [Validators.required, Validators.maxLength(250)]],
    }) as RolFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number): void {
    this.rolesService.buscar(id).subscribe({
      next: (response) => {
        const rol = response.data[0] as IRolResult | undefined;

        if (!rol) {
          void Swal.fire({
            icon: 'error',
            title: 'Rol no encontrado',
            text: 'No se encontró el rol solicitado.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.formData.patchValue({
          ideRol: rol.ide_rol,

          nombreRol: rol.nombre_rol,

          descripcionRol: rol.descripcion_rol,
        });
      },

      error: (error) => {
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el rol',
          text: this.obtenerErrorHttp(error),
        }).then(() => {
          this.location.back();
        });
      },
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Revise los campos obligatorios.',
      });

      return;
    }

    const raw = this.formData.getRawValue();

    const nombreRol = raw.nombreRol.trim();

    const descripcionRol = raw.descripcionRol.trim();

    if (this.isAdd) {
      const body: Omit<IRol, 'ideRol'> = {
        nombreRol,
        descripcionRol,
      };

      this.rolesService.insertar(body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Rol registrado');
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: this.obtenerErrorHttp(error),
          });
        },
      });

      return;
    }

    void Swal.fire({
      title: '¿Actualizar rol?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const body: IRol = {
        ideRol: this.idParam,

        nombreRol,

        descripcionRol,
      };

      this.rolesService.actualizar(this.idParam, body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Rol actualizado');
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo actualizar',
            text: this.obtenerErrorHttp(error),
          });
        },
      });
    });
  }

  protected cancelar(): void {
    void Swal.fire({
      title: '¿Cancelar cambios?',

      text: 'La información no guardada se perderá.',

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

  private procesarRespuesta(
    response: IResultDataCreate,
    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensajeLegacy(
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

  private obtenerMensajeLegacy(
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
        message?: string;
      };

      message?: string;
    };

    return (
      httpError.error?.message ??
      httpError.message ??
      'Ocurrió un error inesperado.'
    );
  }
}
