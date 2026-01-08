import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTableListComponent } from '@shared/components/table-list/table-list.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location } from '@angular/common';
import { EmpresasService } from '@services/empresas.service';
import { IEmpresa } from '@models';
import { PreciosEmpresaConfig } from './precios.config';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTableListComponent,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected readonly config = PreciosEmpresaConfig;
  protected empresa!: IEmpresa;
  protected idEmpresa!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idEmpresa = idParam;
      this.loadEmpresa();
    }
  }

  protected loadEmpresa() {
    this._loadingService.show();
    this._empresasService.buscar(this.idEmpresa).subscribe((res) => {
      const data = res.data[0];
      this.empresa = {
        ideEmp: data.ide_empr,
        nombreEmp: data.nombre_empr,
        responsableEmp: data.responsable_empr,
        fechaContratoEmp: data.fecha_contrato_empr,
        direccionEmp: data.direccion_empr,
        telefonoEmp: data.telefono_empr,
        emailEmp: data.email_empr,
        estadoEmp: data.estado_empr,
        descripcionEmp: data.descripcion_empr
      };
      this._loadingService.hide();
    });
  }

  protected volver() {
    this.location.back();
  }
}
