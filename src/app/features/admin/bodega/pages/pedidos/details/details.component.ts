import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LoadingService } from '@shared/services/loading.service';
import { IPedido, IResultDataPedido } from '@models';
import { PedidosService, EmpresasService } from '@services/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    UiDatetimePickerComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected pedido: IPedido | null = null;
  protected empresaNombre: string | null = null;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.loadPedido(+id);
    }
  }

  private loadPedido(id: number): void {
    this._loadingService.show();
    this._pedidosService.buscar(id).subscribe({
      next: (response: IResultDataPedido) => {
        if (response.data && response.data.length > 0) {
          const p = response.data[0];
          this.pedido = {
            idePedi: p.ide_pedi,
            ideEmpr: p.ide_empr,
            fechaPedi: p.fecha_pedi,
            fechaEntrPedi: p.fecha_entr_pedi,
            cantidadTotalPedi: p.cantidad_total_pedi,
            totalPedi: p.total_pedi,
            estadoPedi: p.estado_pedi,
            motivoPedi: p.motivo_pedi,
            observacionPedi: p.observacion_pedi
          };
          this.loadEmpresaNombre();
        }
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide(),
    });
  }

  private loadEmpresaNombre(): void {
    if (!this.pedido) return;

    this._empresasService.listarComboEmpresas().subscribe({
      next: (options: IComboBoxOption[]) => {
        const found = options.find(o => +o.value === this.pedido!.ideEmpr);
        this.empresaNombre = found?.label ?? null;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
