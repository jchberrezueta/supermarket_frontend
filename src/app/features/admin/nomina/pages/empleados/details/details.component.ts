import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule } from '@angular/common';
import { EmpleadosService } from '@services/empleados.service';
import { IEmpleado } from '@models';
import { LoadingService } from '@shared/services/loading.service';

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
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected empleado: IEmpleado | null = null;
  protected idEmpleado!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idEmpleado = +idParam;
      this.loadEmpleado();
    }
  }

  protected loadEmpleado() {
    this._loadingService.show();
    this._empleadosService.buscar(this.idEmpleado).subscribe({
      next: (res) => {
        const data = res.data[0];
        this.empleado = {
          ideEmpl: data.ide_empl,
          ideRol: data.ide_rol,
          cedulaEmpl: data.cedula_empl,
          fechaNacimientoEmpl: data.fecha_nacimiento_empl,
          edadEmpl: data.edad_empl,
          fechaInicioEmpl: data.fecha_inicio_empl,
          primerNombreEmpl: data.primer_nombre_empl,
          apellidoPaternoEmpl: data.apellido_paterno_empl,
          rmuEmpl: data.rmu_empl,
          tituloEmpl: data.titulo_empl,
          estadoEmpl: data.estado_empl,
          segundoNombreEmpl: data.segundo_nombre_empl,
          apellidoMaternoEmpl: data.apellido_materno_empl,
          fechaTerminoEmpl: data.fecha_termino_empl
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver() {
    this.location.back();
  }
}
