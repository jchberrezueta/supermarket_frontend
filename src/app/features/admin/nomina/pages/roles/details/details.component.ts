import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule } from '@angular/common';
import { RolesService } from '@services/roles.service';
import { LoadingService } from '@shared/services/loading.service';

interface IRolView {
  ideRol: number;
  nombreRol: string;
  descripcionRol: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _rolesService = inject(RolesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected rol: IRolView | null = null;
  protected idRol!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idRol = +idParam;
      this.loadData();
    }
  }

  protected loadData(): void {
    this._loadingService.show();
    this._rolesService.buscar(this.idRol).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.rol = {
          ideRol: data.ide_rol,
          nombreRol: data.nombre_rol,
          descripcionRol: data.descripcion_rol
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