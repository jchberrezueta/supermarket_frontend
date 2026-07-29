import { CommonModule, Location } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { IResultDataCreate } from '@core/models';

import { FormGroupOf } from '@core/utils/utilities';

import {
  EnumEstadosCuenta,
  ICreateCuenta,
  ICuentaForm,
  ICuentaResult,
  IUpdateCuenta,
  ListEstadosCuenta,
} from '@models';

import {
  CuentasService,
  EmpleadosService,
  PerfilesService,
} from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type CuentaFormGroup = FormGroupOf<ICuentaForm>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiButtonComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly cuentasService = inject(CuentasService);

  private readonly empleadosService = inject(EmpleadosService);

  private readonly perfilesService = inject(PerfilesService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected formData!: CuentaFormGroup;

  protected empleados: IComboBoxOption[] = [];

  protected perfiles: IComboBoxOption[] = [];

  protected readonly estadosCuenta = ListEstadosCuenta;

  protected isAdd = true;

  private idParam = -1;

  private initialFormValue!: ICuentaForm;

  ngOnInit(): void {
    this.initForm();
    this.loadCombos();

    const idParam = this.route.snapshot.paramMap.get('id');

    /*
     * Si la ruta no contiene ID,
     * estamos creando una cuenta.
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
        text: 'El identificador de la cuenta no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    /*
     * La cuenta 0 es la cuenta
     * administrativa principal.
     */
    if (id === 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Cuenta protegida',
        text: 'La cuenta administrativa principal no puede modificarse.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;

    this.configureUpdateForm();
    this.setData(id);
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideCuen: [
        {
          value: -1,
          disabled: true,
        },
        [Validators.required],
      ],

      ideEmpl: [-1, [Validators.required, Validators.min(0)]],

      idePerf: [-1, [Validators.required, Validators.min(0)]],

      usuarioCuen: ['', [Validators.required, Validators.maxLength(25)]],

      passwordCuen: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ],
      ],

      estadoCuen: [EnumEstadosCuenta.ACTIVO, [Validators.required]],
    }) as CuentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private configureUpdateForm(): void {
    const passwordControl = this.formData.controls.passwordCuen;

    passwordControl.clearValidators();
    passwordControl.setValue('');
    passwordControl.disable();

    passwordControl.updateValueAndValidity();
  }

  private loadCombos(): void {
    this.empleadosService.listarComboEmpleados().subscribe({
      next: (response) => {
        this.empleados = response ?? [];
      },
    });

    this.perfilesService.listarComboPerfiles().subscribe({
      next: (response) => {
        this.perfiles = response ?? [];
      },
    });
  }

  private setData(id: number): void {
    this.loadingService.show();

    this.cuentasService.buscar(id).subscribe({
      next: (response) => {
        const cuenta = response.data[0] as ICuentaResult | undefined;

        if (!cuenta) {
          this.loadingService.hide();

          void Swal.fire({
            icon: 'error',
            title: 'Cuenta no encontrada',
            text: 'No se encontró la cuenta indicada.',
          });

          this.location.back();
          return;
        }

        this.formData.patchValue({
          ideCuen: cuenta.ide_cuen,

          ideEmpl: cuenta.ide_empl,

          idePerf: cuenta.ide_perf,

          usuarioCuen: cuenta.usuario_cuen,

          estadoCuen: cuenta.estado_cuen,
        });

        this.loadingService.hide();
      },

      error: () => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',
          text: 'No fue posible consultar la cuenta.',
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

    if (
      this.isAdd &&
      !this.passwordValida(this.formData.controls.passwordCuen.value)
    ) {
      void Swal.fire({
        icon: 'warning',
        title: 'Contraseña insegura',
        text: 'Debe contener mayúscula, minúscula, número y carácter especial.',
      });

      return;
    }

    if (this.isAdd) {
      this.insertar();
      return;
    }

    this.confirmarActualizacion();
  }

  private insertar(): void {
    const raw = this.formData.getRawValue();

    const body: ICreateCuenta = {
      ideEmpl: Number(raw.ideEmpl),

      idePerf: Number(raw.idePerf),

      usuarioCuen: raw.usuarioCuen.trim().toLowerCase(),

      passwordCuen: raw.passwordCuen,

      estadoCuen: raw.estadoCuen,
    };

    this.loadingService.show();

    this.cuentasService.insertar(body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.procesarRespuesta(response, 'Cuenta registrada', true);
      },

      error: (error) => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar',
          text: this.obtenerErrorHttp(error),
        });
      },
    });
  }

  private confirmarActualizacion(): void {
    void Swal.fire({
      title: '¿Actualizar cuenta?',
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

  private actualizar(): void {
    const raw = this.formData.getRawValue();

    const body: IUpdateCuenta = {
      ideCuen: this.idParam,

      ideEmpl: Number(raw.ideEmpl),

      idePerf: Number(raw.idePerf),

      usuarioCuen: raw.usuarioCuen.trim().toLowerCase(),

      estadoCuen: raw.estadoCuen,
    };

    this.loadingService.show();

    this.cuentasService.actualizar(this.idParam, body).subscribe({
      next: (response) => {
        this.loadingService.hide();

        this.procesarRespuesta(response, 'Cuenta actualizada', true);
      },

      error: (error) => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo actualizar',
          text: this.obtenerErrorHttp(error),
        });
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

  private procesarRespuesta(
    response: IResultDataCreate,
    title: string,
    goBack: boolean,
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

      title: success ? title : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success && goBack) {
        this.location.back();
      }
    });
  }

  private passwordValida(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
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

  private obtenerErrorHttp(error: any): string {
    const message = error?.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'Ocurrió un error al comunicarse con el servidor.';
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }
}
