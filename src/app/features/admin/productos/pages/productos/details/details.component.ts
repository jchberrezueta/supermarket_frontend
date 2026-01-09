import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { LoadingService } from '@shared/services/loading.service';
import { IProducto, IResultDataProducto } from '@models';
import { ProductosService, CategoriasService, MarcasService } from '@services/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _productosService = inject(ProductosService);
  private readonly _categoriasService = inject(CategoriasService);
  private readonly _marcasService = inject(MarcasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected producto: IProducto | null = null;
  protected categoriaNombre: string | null = null;
  protected marcaNombre: string | null = null;

  ngOnInit(): void {
    const id = this._route.snapshot.params['id'];
    if (id) {
      this.loadProducto(+id);
    }
  }

  private loadProducto(id: number): void {
    this._loadingService.show();
    this._productosService.buscar(id).subscribe({
      next: (response: IResultDataProducto) => {
        if (response.data && response.data.length > 0) {
          const p = response.data[0];
          this.producto = {
            ideProd: p.ide_prod,
            ideCate: p.ide_cate,
            ideMarc: p.ide_marc,
            codigoBarraProd: p.codigo_barra_prod,
            nombreProd: p.nombre_prod,
            precioVentaProd: p.precio_venta_prod,
            ivaProd: p.iva_prod,
            dctoPromoProd: p.dcto_promo_prod,
            stockProd: p.stock_prod,
            disponibleProd: p.disponible_prod,
            estadoProd: p.estado_prod,
            descripcionProd: p.descripcion_prod,
            urlImgProd: p.url_img_prod,
          };
          this.loadCategoriaMarcaNombres();
        }
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide(),
    });
  }

  private loadCategoriaMarcaNombres(): void {
    if (!this.producto) return;

    this._categoriasService.listarComboCategorias().subscribe({
      next: (options: IComboBoxOption[]) => {
        const found = options.find(o => +o.value === this.producto!.ideCate);
        this.categoriaNombre = found?.label ?? null;
      }
    });

    this._marcasService.listarComboMarcas().subscribe({
      next: (options: IComboBoxOption[]) => {
        const found = options.find(o => +o.value === this.producto!.ideMarc);
        this.marcaNombre = found?.label ?? null;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
