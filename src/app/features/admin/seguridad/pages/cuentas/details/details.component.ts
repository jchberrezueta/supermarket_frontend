import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location } from '@angular/common';
import { CuentasService } from '@services/index';
import { ICuenta } from '@models';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _cuentasService = inject(CuentasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected cuenta!: ICuenta;
  protected idCuenta!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idCuenta = idParam;
      this.loadCuenta();
    }
  }

  protected loadCuenta() {
    this._loadingService.show();
    this._cuentasService.buscar(this.idCuenta).subscribe((res) => {
      const data = res.data[0];
      this.cuenta = {
        ideCuen: data.ide_cuen,
        ideEmpl: data.ide_empl,
        idePerf: data.ide_perf,
        usuarioCuen: data.usuario_cuen,
        passwordCuen: data.password_cuen,
        estadoCuen: data.estado_cuen
      };
      this._loadingService.hide();
    });
  }

  protected volver() {
    this.location.back();
  }
}
