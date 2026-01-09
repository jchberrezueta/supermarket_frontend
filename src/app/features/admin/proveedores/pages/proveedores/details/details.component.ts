import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';

import { ProveedoresService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

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
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected proveedor: any = null;
  protected idProv = -1;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.idProv = +id;
      this.loadProveedor();
    }
  }

  protected loadProveedor(): void {
    this._loadingService.show();
    this._proveedoresService.buscarProveedor(this.idProv).subscribe({
      next: (res) => {
        this.proveedor = res.data[0];
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }
}
