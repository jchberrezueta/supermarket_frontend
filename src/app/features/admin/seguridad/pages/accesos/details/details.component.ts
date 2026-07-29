import { CommonModule, DatePipe, Location } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { IAccesoUsuarioResult } from '@models';

import { AccesosService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiCardComponent } from '@shared/components/card/card.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',

  standalone: true,

  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent,
    UiCardComponent,
  ],

  providers: [DatePipe],

  templateUrl: './details.component.html',

  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly accesosService = inject(AccesosService);

  private readonly loadingService = inject(LoadingService);

  private readonly datePipe = inject(DatePipe);

  protected readonly location = inject(Location);

  protected acceso: IAccesoUsuarioResult | null = null;

  protected idAcceso = -1;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',

        text: 'El identificador del acceso no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.idAcceso = id;
    this.loadData();
  }

  protected loadData(): void {
    if (this.idAcceso <= 0) {
      return;
    }

    this.loadingService.show();

    this.accesosService.buscar(this.idAcceso).subscribe({
      next: (response) => {
        this.loadingService.hide();

        const acceso = response.data[0];

        if (!acceso) {
          this.acceso = null;

          void Swal.fire({
            icon: 'error',
            title: 'Acceso no encontrado',

            text: 'No se encontró el evento de autenticación indicado.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.acceso = acceso;
      },

      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',

          text: this.extractError(error),
        });
      },
    });
  }

  protected volver(): void {
    this.location.back();
  }

  protected formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'No disponible';
    }

    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') ?? date;
  }

  protected formatResultado(): string {
    if (this.acceso?.resultado_acce === 'exitoso') {
      return 'Exitoso';
    }

    return 'Fallido';
  }

  protected formatMotivo(): string {
    const motivo = this.acceso?.motivo_acce;

    if (!motivo) {
      return this.acceso?.resultado_acce === 'exitoso'
        ? 'Autenticación completada'
        : 'Sin motivo registrado';
    }

    const motivos: Record<string, string> = {
      credenciales_invalidas: 'Credenciales inválidas',

      cuenta_inactiva: 'Cuenta inactiva',

      cuenta_bloqueada: 'Cuenta bloqueada administrativamente',

      bloqueo_temporal: 'Bloqueo temporal vigente',

      max_intentos: 'Máximo de intentos alcanzado',

      codigo_mfa_invalido: 'Código MFA inválido',

      max_intentos_mfa: 'Máximo de intentos MFA alcanzado',
    };

    return (
      motivos[motivo] ??
      motivo
        .replaceAll('_', ' ')
        .replace(/^\w/, (letter) => letter.toUpperCase())
    );
  }

  protected usuarioMostrado(): string {
    return (
      this.acceso?.usuario_cuen ??
      this.acceso?.usuario_intentado ??
      'No disponible'
    );
  }

  protected estadoCuenta(): string {
    const estado = this.acceso?.estado_cuen;

    if (!estado) {
      return 'No disponible';
    }

    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  protected hasLocation(): boolean {
    return (
      this.acceso?.latitud_acce !== null &&
      this.acceso?.latitud_acce !== undefined &&
      this.acceso?.longitud_acce !== null &&
      this.acceso?.longitud_acce !== undefined
    );
  }

  protected mapUrl(): string {
    if (!this.hasLocation()) {
      return '';
    }

    return (
      'https://www.google.com/maps?q=' +
      `${this.acceso!.latitud_acce},` +
      `${this.acceso!.longitud_acce}`
    );
  }

  private extractError(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'No fue posible consultar el evento de autenticación.';
  }
}
