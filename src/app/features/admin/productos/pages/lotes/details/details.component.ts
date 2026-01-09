import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LoadingService } from '@shared/services/loading.service';
import { ILote, IResultDataLote } from '@models';
import { LotesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiButtonComponent,
    UiDatetimePickerComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _lotesService = inject(LotesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected lote: ILote | null = null;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.loadLote(+id);
    }
  }

  private loadLote(id: number): void {
    this._loadingService.show();
    this._lotesService.buscar(id).subscribe({
      next: (response: IResultDataLote) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          this.lote = {
            ideLote: data.ide_lote,
            ideProd: data.ide_prod,
            fechaCaducidadLote: data.fecha_caducidad_lote,
            stockLote: data.stock_lote,
            estadoLote: data.estado_lote
          };
        }
        this._loadingService.hide();
      },
      error: () => {
        this._loadingService.hide();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
