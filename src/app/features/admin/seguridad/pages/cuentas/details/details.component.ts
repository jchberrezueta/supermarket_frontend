import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CuentasService, EmpleadosService, PerfilesService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';

interface ICuentaView {
  ideCuen: number;
  ideEmpl: number;
  nombreEmpleado: string;
  idePerf: number;
  nombrePerfil: string;
  usuarioCuen: string;
  estadoCuen: string;
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
  private readonly _cuentasService = inject(CuentasService);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected cuenta: ICuentaView | null = null;
  protected idCuenta!: number;
  
  private empleados: IComboBoxOption[] = [];
  private perfiles: IComboBoxOption[] = [];

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idCuenta = +idParam;
      this.loadCuenta();
    }
  }

  protected loadCuenta() {
    this._loadingService.show();
    
    forkJoin({
      cuenta: this._cuentasService.buscar(this.idCuenta),
      empleados: this._empleadosService.listarComboEmpleados(),
      perfiles: this._perfilesService.listarComboPerfiles()
    }).subscribe({
      next: (res) => {
        this.empleados = res.empleados;
        this.perfiles = res.perfiles;
        
        const data = res.cuenta.data[0];
        const nombreEmpleado = this.empleados.find(e => +e.value === data.ide_empl)?.label || `ID: ${data.ide_empl}`;
        const nombrePerfil = this.perfiles.find(p => +p.value === data.ide_perf)?.label || `ID: ${data.ide_perf}`;
        
        this.cuenta = {
          ideCuen: data.ide_cuen,
          ideEmpl: data.ide_empl,
          nombreEmpleado: nombreEmpleado,
          idePerf: data.ide_perf,
          nombrePerfil: nombrePerfil,
          usuarioCuen: data.usuario_cuen,
          estadoCuen: data.estado_cuen
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver() {
    this.location.back();
  }

  protected getEstadoClass(): string {
    switch (this.cuenta?.estadoCuen) {
      case 'activo': return 'estado-activo';
      case 'inactivo': return 'estado-inactivo';
      case 'bloqueado': return 'estado-bloqueado';
      default: return '';
    }
  }
}
