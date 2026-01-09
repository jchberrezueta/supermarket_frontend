import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, CurrencyPipe } from '@angular/common';
import { ProductosService } from '@services/productos.service';
import { LoadingService } from '@shared/services/loading.service';

interface IProductoView {
  ideProd: number;
  nombreCate: string;
  nombreMarc: string;
  codigoBarraProd: string;
  nombreProd: string;
  precioVentaProd: number;
  ivaProd: number;
  dctoPromoProd: number;
  stockProd: number;
  disponibleProd: string;
  estadoProd: string;
  descripcionProd: string;
  urlImgProd: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _productosService = inject(ProductosService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected producto: IProductoView | null = null;
  protected idProducto!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idProducto = +idParam;
      this.loadProducto();
    }
  }

  protected loadProducto(): void {
    this._loadingService.show();
    this._productosService.buscar(this.idProducto).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.producto = {
          ideProd: data.ide_prod,
          nombreCate: data.nombre_cate,
          nombreMarc: data.nombre_marc,
          codigoBarraProd: data.codigo_barra_prod,
          nombreProd: data.nombre_prod,
          precioVentaProd: data.precio_venta_prod,
          ivaProd: data.iva_prod,
          dctoPromoProd: data.dcto_promo_prod,
          stockProd: data.stock_prod,
          disponibleProd: data.disponible_prod,
          estadoProd: data.estado_prod,
          descripcionProd: data.descripcion_prod,
          urlImgProd: data.url_img_prod
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
