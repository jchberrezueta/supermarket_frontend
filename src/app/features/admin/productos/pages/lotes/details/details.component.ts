import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, DatePipe } from '@angular/common';
import { LotesService } from '@services/lotes.service';
import { LoadingService } from '@shared/services/loading.service';

interface ILoteView {
  ideLote: number;
  nombreProd: string;
  fechaCaducidadLote: string;
  stockLote: number;
  estadoLote: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  providers: [DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _lotesService = inject(LotesService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _datePipe = inject(DatePipe);
  public location = inject(Location);

  protected lote: ILoteView | null = null;
  protected idLote!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idLote = +idParam;
      this.loadLote();
    }
  }

  protected loadLote(): void {
    this._loadingService.show();
    this._lotesService.buscar(this.idLote).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.lote = {
          ideLote: data.ide_lote,
          nombreProd: data.nombre_prod,
          fechaCaducidadLote: data.fecha_caducidad_lote,
          stockLote: data.stock_lote,
          estadoLote: data.estado_lote
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }

  protected formatDate(date: string): string {
    return this._datePipe.transform(date, 'dd/MM/yyyy') || date;
  }
}
