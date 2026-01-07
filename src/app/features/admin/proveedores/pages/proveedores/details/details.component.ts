import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProveedoresService } from '@services/index';
import { IProveedorResult } from '@models';

import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTextFieldComponent,
    UiDatetimePickerComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _proveedoresService = inject(ProveedoresService);
  public location = inject(Location);

  protected proveedor!: IProveedorResult;
  protected idProv = -1;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.idProv = +id;
      this.loadProveedor();
    }
  }

  private loadProveedor(): void {
    this._proveedoresService.buscar(this.idProv).subscribe(res => {
      this.proveedor = res.data[0] as IProveedorResult;
    });
  }

  protected volver(): void {
    this.location.back();
  }
}
