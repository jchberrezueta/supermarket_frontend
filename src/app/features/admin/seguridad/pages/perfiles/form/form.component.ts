import { CommonModule, Location } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { IResultDataCreate } from '@core/models';

import { FormGroupOf } from '@core/utils/utilities';

import { ICreatePerfil, IPerfil, IPerfilResult, IUpdatePerfil } from '@models';

import { PerfilesService, RolesService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type PerfilFormGroup = FormGroupOf<IPerfil>;

@Component({
  selector: 'app-form',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiComboBoxComponent,
    UiButtonComponent,
  ],

  templateUrl: './form.component.html',

  styleUrl: './form.component.scss',
})
export default class FormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly perfilesService = inject(PerfilesService);

  private readonly rolesService = inject(RolesService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected formData!: PerfilFormGroup;

  protected roles: IComboBoxOption[] = [];

  protected isAdd = true;

  private idParam = -1;

  private initialFormValue!: IPerfil;

  ngOnInit(): void {
    this.initForm();
    this.loadCombos();

    const idParam = this.route.snapshot.paramMap.get('id');

    /*
     * La ruta de creación no contiene ID.
     */
    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',
        text: 'El identificador del perfil no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    /*
     * El perfil 0 corresponde al
     * administrador principal.
     */
    if (id === 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Perfil protegido',
        text: 'El perfil administrador principal no puede modificarse.',
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
      idePerf: [
        {
          value: -1,
          disabled: true,
        },
        [Validators.required],
      ],

      ideRol: [-1, [Validators.required, Validators.min(0)]],

      nombrePerf: ['', [Validators.required, Validators.maxLength(50)]],

      descripcionPerf: ['', [Validators.required, Validators.maxLength(250)]],
    }) as PerfilFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCombos(): void {
    this.rolesService.listarComboRoles().subscribe({
      next: (response) => {
        this.roles = response ?? [];
      },
    });
  }

  private setData(id: number): void {
    this.loadingService.show();

    this.perfilesService.buscar(id).subscribe({
      next: (response) => {
        const perfil = response.data[0] as IPerfilResult | undefined;

        if (!perfil) {
          this.loadingService.hide();

          void Swal.fire({
            icon: 'error',
            title: 'Perfil no encontrado',
          }).then(() => this.location.back());

          return;
        }

        this.formData.patchValue({
          idePerf: perfil.ide_perf,

          ideRol: perfil.ide_rol,

          nombrePerf: perfil.nombre_perf,

          descripcionPerf: perfil.descripcion_perf ?? '',
        });

        this.loadingService.hide();
      },

      error: () => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',

          text: 'No fue posible consultar el perfil.',
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

    if (this.isAdd) {
      this.insertar();
      return;
    }

    void Swal.fire({
      title: '¿Actualizar perfil?',

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

    const body: ICreatePerfil = {
      ideRol: Number(raw.ideRol),

      nombrePerf: raw.nombrePerf.trim().toLowerCase(),

      descripcionPerf: raw.descripcionPerf.trim(),
    };

    this.loadingService.show();

    this.perfilesService.insertar(body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.processResponse(response, 'Perfil registrado');
      },

      error: (error) => {
        this.loadingService.hide();

        this.showHttpError(error, 'No se pudo registrar el perfil.');
      },
    });
  }

  private actualizar(): void {
    const raw = this.formData.getRawValue();

    const body: IUpdatePerfil = {
      idePerf: this.idParam,

      ideRol: Number(raw.ideRol),

      nombrePerf: raw.nombrePerf.trim().toLowerCase(),

      descripcionPerf: raw.descripcionPerf.trim(),
    };

    this.loadingService.show();

    this.perfilesService.actualizar(this.idParam, body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.processResponse(response, 'Perfil actualizado');
      },

      error: (error) => {
        this.loadingService.hide();

        this.showHttpError(error, 'No se pudo actualizar el perfil.');
      },
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

  private processResponse(
    response: IResultDataCreate,

    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.parseLegacyMessage(
      response.p_response,
      success
        ? 'Operación completada correctamente.'
        : 'La operación fue rechazada.',
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

  private parseLegacyMessage(
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
