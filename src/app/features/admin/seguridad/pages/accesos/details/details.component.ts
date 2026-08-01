import { CommonModule, DatePipe, Location } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { ElementRef, OnDestroy, viewChild } from '@angular/core';

import * as L from 'leaflet';

import { ActivatedRoute } from '@angular/router';

import { IAccesoUsuarioResult } from '@models';

import { AccesosService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiCardComponent } from '@shared/components/card/card.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-details',

  standalone: true,

  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent,
    UiCardComponent,
    UiDatetimePickerComponent,
  ],

  providers: [DatePipe],

  templateUrl: './details.component.html',

  styleUrl: './details.component.scss',
})
export default class DetailsComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);

  private readonly accesosService = inject(AccesosService);

  private readonly loadingService = inject(LoadingService);

  private readonly datePipe = inject(DatePipe);

  protected readonly location = inject(Location);

  protected acceso: IAccesoUsuarioResult | null = null;

  protected idAcceso = -1;

  private readonly mapaAcceso =
    viewChild<ElementRef<HTMLDivElement>>('mapaAcceso');

  private mapa: L.Map | null = null;

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
          this.destruirMapa();

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
        this.actualizarMapa();
      },

      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',

          text: this.extractError(error),
        });
        this.destruirMapa();
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

  /*protected hasLocation(): boolean {
    return (
      this.acceso?.latitud_acce !== null &&
      this.acceso?.latitud_acce !== undefined &&
      this.acceso?.longitud_acce !== null &&
      this.acceso?.longitud_acce !== undefined
    );
  }*/

  /* protected mapUrl(): string {
    if (!this.hasLocation()) {
      return '';
    }

    return (
      'https://www.google.com/maps?q=' +
      `${this.acceso!.latitud_acce},` +
      `${this.acceso!.longitud_acce}`
    );
  }*/

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

  protected hasLocation(): boolean {
    if (!this.acceso) {
      return false;
    }

    const latitudOriginal = this.acceso.latitud_acce;
    const longitudOriginal = this.acceso.longitud_acce;

    if (
      latitudOriginal === null ||
      latitudOriginal === undefined ||
      latitudOriginal + '' === '' ||
      longitudOriginal === null ||
      longitudOriginal === undefined ||
      longitudOriginal + '' === ''
    ) {
      return false;
    }

    const latitud = Number(latitudOriginal);
    const longitud = Number(longitudOriginal);

    return (
      Number.isFinite(latitud) &&
      Number.isFinite(longitud) &&
      latitud >= -90 &&
      latitud <= 90 &&
      longitud >= -180 &&
      longitud <= 180
    );
  }

  private actualizarMapa(): void {
    this.destruirMapa();

    if (!this.hasLocation()) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const elementoMapa = this.mapaAcceso()?.nativeElement;

        if (!elementoMapa || !this.hasLocation()) {
          return;
        }

        const latitud = Number(this.acceso!.latitud_acce);
        const longitud = Number(this.acceso!.longitud_acce);

        this.mapa = L.map(elementoMapa, {
          center: [latitud, longitud],
          zoom: 16,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">' +
            'OpenStreetMap</a> contributors',
        }).addTo(this.mapa);

        L.circleMarker([latitud, longitud], {
          radius: 9,
        })
          .addTo(this.mapa)
          .bindPopup(
            `
            <strong>Ubicación del acceso</strong><br>
            Latitud: ${latitud}<br>
            Longitud: ${longitud}
          `,
          )
          .openPopup();

        this.mapa.invalidateSize();
      });
    });
  }

  private destruirMapa(): void {
    if (!this.mapa) {
      return;
    }

    this.mapa.remove();
    this.mapa = null;
  }

  protected mapUrl(): string {
    if (!this.hasLocation()) {
      return '';
    }

    const latitud = Number(this.acceso?.latitud_acce);
    const longitud = Number(this.acceso?.longitud_acce);

    return (
      `https://www.openstreetmap.org/` +
      `?mlat=${latitud}` +
      `&mlon=${longitud}` +
      `#map=17/${latitud}/${longitud}`
    );
  }

  public ngOnDestroy(): void {
    this.destruirMapa();
  }
}
