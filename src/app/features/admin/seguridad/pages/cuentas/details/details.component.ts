import { CommonModule, Location } from '@angular/common';

import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ICuentaResult } from '@models';

import {
  CuentasService,
  EmpleadosService,
  PerfilesService,
} from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { LoadingService } from '@shared/services/loading.service';

import { AuthService } from '@core/services/auth.service';

import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';
import { UiCardComponent } from '@shared/components/card/card.component';

interface ICuentaView {
  ideCuen: number;
  ideEmpl: number;
  nombreEmpleado: string;
  idePerf: number;
  nombrePerfil: string;
  usuarioCuen: string;
  estadoCuen: string;
  debeCambiarClave: boolean;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly cuentasService = inject(CuentasService);

  private readonly empleadosService = inject(EmpleadosService);

  private readonly perfilesService = inject(PerfilesService);

  private readonly loadingService = inject(LoadingService);

  private readonly authService = inject(AuthService);

  protected readonly location = inject(Location);

  protected cuenta: ICuentaView | null = null;

  protected idCuenta = -1;

  protected readonly canResetPassword = this.authService.canUpdate(
    '/admin/seguridad/cuentas',
  );

  private empleados: IComboBoxOption[] = [];

  private perfiles: IComboBoxOption[] = [];

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id >= 0) {
      this.idCuenta = id;
      this.loadCuenta();
    }
  }

  protected loadCuenta(): void {
    this.loadingService.show();

    forkJoin({
      cuenta: this.cuentasService.buscar(this.idCuenta),

      empleados: this.empleadosService.listarComboEmpleados(),

      perfiles: this.perfilesService.listarComboPerfiles(),
    }).subscribe({
      next: (response) => {
        this.empleados = response.empleados ?? [];

        this.perfiles = response.perfiles ?? [];

        const data = response.cuenta.data[0] as ICuentaResult | undefined;

        if (!data) {
          this.loadingService.hide();

          void Swal.fire({
            icon: 'error',
            title: 'Cuenta no encontrada',
          });

          return;
        }

        const nombreEmpleado =
          data.nombre_empleado ||
          this.empleados.find(
            (empleado) => Number(empleado.value) === data.ide_empl,
          )?.label ||
          `ID: ${data.ide_empl}`;

        const nombrePerfil =
          data.nombre_perf ||
          this.perfiles.find((perfil) => Number(perfil.value) === data.ide_perf)
            ?.label ||
          `ID: ${data.ide_perf}`;

        this.cuenta = {
          ideCuen: data.ide_cuen,

          ideEmpl: data.ide_empl,

          nombreEmpleado,

          idePerf: data.ide_perf,

          nombrePerfil,

          usuarioCuen: data.usuario_cuen,

          estadoCuen: data.estado_cuen,

          debeCambiarClave: data.debe_cambiar_clave,
        };

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

  protected restablecerClave(): void {
    if (!this.cuenta || this.idCuenta === 0) {
      return;
    }

    void Swal.fire({
      title: 'Restablecer contraseña',

      text: `Asigna una contraseña temporal para ${this.cuenta.usuarioCuen}.`,

      input: 'password',

      inputLabel: 'Contraseña temporal',

      inputPlaceholder: 'Ingresa la contraseña temporal',

      showCancelButton: true,

      confirmButtonText: 'Restablecer',

      cancelButtonText: 'Cancelar',

      inputAttributes: {
        autocomplete: 'new-password',
        minlength: '8',
        maxlength: '100',
      },

      preConfirm: (value: string) => {
        if (!this.passwordValida(value)) {
          Swal.showValidationMessage(
            'Debe tener al menos 8 caracteres, mayúscula, minúscula, número y carácter especial.',
          );

          return false;
        }

        return value;
      },
    }).then((result) => {
      if (result.isConfirmed && typeof result.value === 'string') {
        this.enviarRestablecimiento(result.value);
      }
    });
  }

  private enviarRestablecimiento(claveTemporal: string): void {
    this.loadingService.show();

    this.cuentasService
      .restablecerClave(this.idCuenta, claveTemporal)
      .subscribe({
        next: (response) => {
          this.loadingService.hide();

          const success = Number(response.p_result) === 1;

          const message = this.obtenerMensaje(
            response.p_response,
            success
              ? 'Contraseña restablecida correctamente.'
              : 'No se pudo restablecer la contraseña.',
          );

          void Swal.fire({
            icon: success ? 'success' : 'error',

            title: success ? 'Contraseña restablecida' : 'Operación rechazada',

            text: message,
          });

          if (success) {
            this.loadCuenta();
          }
        },

        error: (error) => {
          this.loadingService.hide();

          const message = error?.error?.message;

          void Swal.fire({
            icon: 'error',
            title: 'No se pudo restablecer',

            text:
              typeof message === 'string'
                ? message
                : 'Ocurrió un error al comunicarse con el servidor.',
          });
        },
      });
  }

  protected volver(): void {
    this.location.back();
  }

  protected getEstadoClass(): string {
    switch (this.cuenta?.estadoCuen) {
      case 'activo':
        return 'estado-activo';

      case 'inactivo':
        return 'estado-inactivo';

      case 'bloqueado':
        return 'estado-bloqueado';

      default:
        return '';
    }
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

  private obtenerMensaje(response: string, fallback: string): string {
    try {
      const parsed = JSON.parse(response) as {
        message?: string;
      };

      return parsed.message ?? fallback;
    } catch {
      return response || fallback;
    }
  }
}
