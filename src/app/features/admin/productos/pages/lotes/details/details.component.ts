import { CommonModule, DatePipe, Location } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { EstadoLote, ILoteResult } from '@models';

import { LotesService } from '@services/lotes.service';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';
import { UiCardComponent } from '../../../../../../shared/components/card/card.component';

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

  private readonly lotesService = inject(LotesService);

  private readonly loadingService = inject(LoadingService);

  private readonly datePipe = inject(DatePipe);

  protected readonly location = inject(Location);

  protected lote: ILoteResult | null = null;

  protected idLote = -1;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Identificador inválido',

        text: 'El identificador del lote no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.idLote = id;
    this.loadLote();
  }

  protected loadLote(): void {
    if (this.idLote <= 0) {
      return;
    }

    this.loadingService.show();

    this.lotesService.buscar(this.idLote).subscribe({
      next: (response) => {
        this.loadingService.hide();

        const lote = response.data[0];

        if (!lote) {
          this.lote = null;

          void Swal.fire({
            icon: 'error',
            title: 'Lote no encontrado',

            text: 'No se encontró el lote indicado.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.lote = lote;
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

    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? date;
  }

  protected estadoLabel(estado: EstadoLote | undefined): string {
    switch (estado) {
      case 'correcto':
        return 'Correcto';

      case 'proximo':
        return 'Próximo a caducar';

      case 'caducado':
        return 'Caducado';

      case 'devuelto':
        return 'Devuelto';

      default:
        return 'No disponible';
    }
  }

  protected estadoClass(estado: EstadoLote | undefined): string {
    switch (estado) {
      case 'correcto':
        return 'estado-correcto';

      case 'proximo':
        return 'estado-proximo';

      case 'caducado':
        return 'estado-caducado';

      case 'devuelto':
        return 'estado-devuelto';

      default:
        return '';
    }
  }

  private extractError(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'No fue posible consultar la información del lote.';
  }
}
