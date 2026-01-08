import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LoadingService } from '@shared/services/loading.service';
import { IOpciones, IResultDataOpciones } from '@models';
import { OpcionesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _opcionesService = inject(OpcionesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected opcion: IOpciones | null = null;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.loadOpcion(+id);
    }
  }

  private loadOpcion(id: number): void {
    this._loadingService.show();
    this._opcionesService.buscar(id).subscribe({
      next: (response: IResultDataOpciones) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          this.opcion = {
            ideOpci: data.ide_opci,
            nombreOpci: data.nombre_opci,
            rutaOpci: data.ruta_opci,
            nivelOpci: data.nivel_opci,
            padreOpci: data.padre_opci,
            iconoOpci: data.icono_opci,
            activoOpci: data.activo_opci,
            descripcionOpci: data.descripcion_opci
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
