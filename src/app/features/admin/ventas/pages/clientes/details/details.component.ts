import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, DatePipe } from '@angular/common';
import { ClientesService } from '@services/clientes.service';
import { LoadingService } from '@shared/services/loading.service';

interface IClienteView {
  ideClie: number;
  cedulaClie: string;
  fechaNacimientoClie: string;
  edadClie: number;
  telefonoClie: string;
  primerNombreClie: string;
  segundoNombreClie: string;
  apellidoPaternoClie: string;
  apellidoMaternoClie: string;
  emailClie: string;
  esSocio: string;
  esTerceraEdad: string;
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
  private readonly _clientesService = inject(ClientesService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _datePipe = inject(DatePipe);
  public location = inject(Location);

  protected cliente: IClienteView | null = null;
  protected idCliente!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idCliente = +idParam;
      this.loadCliente();
    }
  }

  protected loadCliente(): void {
    this._loadingService.show();
    this._clientesService.buscar(this.idCliente).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.cliente = {
          ideClie: data.ide_clie,
          cedulaClie: data.cedula_clie,
          fechaNacimientoClie: data.fecha_nacimiento_clie,
          edadClie: data.edad_clie,
          telefonoClie: data.telefono_clie,
          primerNombreClie: data.primer_nombre_clie,
          segundoNombreClie: data.segundo_nombre_clie || '',
          apellidoPaternoClie: data.apellido_paterno_clie,
          apellidoMaternoClie: data.apellido_materno_clie || '',
          emailClie: data.email_clie,
          esSocio: data.es_socio,
          esTerceraEdad: data.es_tercera_edad
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

  protected getNombreCompleto(): string {
    if (!this.cliente) return '';
    const nombres = [
      this.cliente.primerNombreClie,
      this.cliente.segundoNombreClie,
      this.cliente.apellidoPaternoClie,
      this.cliente.apellidoMaternoClie
    ].filter(n => n);
    return nombres.join(' ');
  }
}
