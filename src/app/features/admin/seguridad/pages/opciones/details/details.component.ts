import { Location } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { IOpcionResult } from '@models';

import { OpcionesService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';
import { UiCardComponent } from '../../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-details',
  standalone: true,

  imports: [UiTextFieldComponent, UiButtonComponent, UiCardComponent],

  templateUrl: './details.component.html',

  styleUrl: './details.component.scss',
})
export default class DetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly opcionesService = inject(OpcionesService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected opcion: IOpcionResult | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id >= 0) {
      this.loadOpcion(id);
    }
  }

  protected loadOpcion(id: number): void {
    this.loadingService.show();

    this.opcionesService.buscar(id).subscribe({
      next: (response) => {
        this.opcion = response.data[0] ?? null;

        this.loadingService.hide();

        if (!this.opcion) {
          void Swal.fire({
            icon: 'error',
            title: 'Opción no encontrada',
          }).then(() => this.location.back());
        }
      },

      error: () => {
        this.loadingService.hide();

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar la opción',
        });
      },
    });
  }

  protected goBack(): void {
    this.location.back();
  }
}
