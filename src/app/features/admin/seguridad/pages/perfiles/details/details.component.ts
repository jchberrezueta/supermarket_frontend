import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { PerfilesService } from '@services/perfiles.service';
import { RolesService } from '@services/roles.service';
import { LoadingService } from '@shared/services/loading.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';

interface IPerfilView {
  idePerf: number;
  ideRol: number;
  nombreRol: string;
  nombrePerf: string;
  descripcionPerf: string;
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
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _rolesService = inject(RolesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected perfil: IPerfilView | null = null;
  protected idPerfil!: number;
  private roles: IComboBoxOption[] = [];

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idPerfil = +idParam;
      this.loadData();
    }
  }

  protected loadData(): void {
    this._loadingService.show();
    
    forkJoin({
      perfil: this._perfilesService.buscar(this.idPerfil),
      roles: this._rolesService.listarComboRoles()
    }).subscribe({
      next: (res) => {
        this.roles = res.roles;
        const data = res.perfil.data[0] as any;
        const nombreRol = this.roles.find(r => +r.value === data.ide_rol)?.label || `ID: ${data.ide_rol}`;
        
        this.perfil = {
          idePerf: data.ide_perf,
          ideRol: data.ide_rol,
          nombreRol: nombreRol,
          nombrePerf: data.nombre_perf,
          descripcionPerf: data.descripcion_perf
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