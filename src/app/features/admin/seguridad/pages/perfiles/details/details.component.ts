import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LoadingService } from '@shared/services/loading.service';
import { IPerfil, IResultDataPerfil } from '@models';
import { PerfilesService } from '@services/index';

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
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected perfil: IPerfil | null = null;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.loadPerfil(+id);
    }
  }

  private loadPerfil(id: number): void {
    this._loadingService.show();
    this._perfilesService.buscar(id).subscribe({
      next: (response: IResultDataPerfil) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          this.perfil = {
            idePerf: data.ide_perf,
            ideRol: data.ide_rol,
            nombrePerf: data.nombre_perf,
            descripcionPerf: data.descripcion_perf
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
