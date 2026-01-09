import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule, DatePipe } from '@angular/common';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { AccesosService } from '@services/accesos.service';
import { LoadingService } from '@shared/services/loading.service';

interface IAccesoView {
  ideAcce: number;
  ideCuen: number;
  navegadorAcce: string;
  fechaAcce: string;
  numIntFallAcce: number;
  ipAcce: string;
  latitudAcce: number | null;
  longitudAcce: number | null;
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
  private readonly _accesosService = inject(AccesosService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _datePipe = inject(DatePipe);
  public location = inject(Location);

  protected acceso: IAccesoView | null = null;
  protected idAcceso!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idAcceso = +idParam;
      this.loadData();
    }
  }

  protected loadData(): void {
    this._loadingService.show();
    this._accesosService.buscar(this.idAcceso).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.acceso = {
          ideAcce: data.ide_acce,
          ideCuen: data.ide_cuen,
          navegadorAcce: data.navegador_acce,
          fechaAcce: data.fecha_acce,
          numIntFallAcce: data.num_int_fall_acce,
          ipAcce: data.ip_acce,
          latitudAcce: data.latitud_acce,
          longitudAcce: data.longitud_acce
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
    return this._datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || date;
  }
}