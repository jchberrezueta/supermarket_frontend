import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule } from '@angular/common';
import { MarcasService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';

interface IMarcaView {
  ideMarc: number;
  nombreMarc: string;
  paisOrigenMarc: string;
  calidadMarc: number;
  descripcionMarc: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _marcasService = inject(MarcasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected marca: IMarcaView | null = null;
  protected idMarca!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idMarca = +idParam;
      this.loadMarca();
    }
  }

  protected loadMarca(): void {
    this._loadingService.show();
    this._marcasService.buscar(this.idMarca).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.marca = {
          ideMarc: data.ide_marc,
          nombreMarc: data.nombre_marc,
          paisOrigenMarc: data.pais_origen_marc,
          calidadMarc: data.calidad_marc,
          descripcionMarc: data.descripcion_marc
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }
}
