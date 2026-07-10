import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule, CurrencyPipe } from '@angular/common';
import { ProductosService } from '@services/productos.service';
import { LoadingService } from '@shared/services/loading.service';
import { QrLabelComponent } from '@shared/components/qr-label/qr-label.component';
import * as QRCode from 'qrcode';

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
    UiButtonComponent,
    QrLabelComponent,
  ],
  providers: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _productosService = inject(ProductosService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected producto: IProductoView | null = null;
  protected idProducto!: number;

  protected qrProductoDataUrl = '';

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
          urlImgProd: data.url_img_prod,
        };
        this.generarQrProducto();
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide(),
    });
  }

  private async generarQrProducto(): Promise<void> {
    this.qrProductoDataUrl = '';

    const codigo = this.producto?.codigoBarraProd?.trim();

    if (!codigo) {
      return;
    }

    try {
      this.qrProductoDataUrl = await QRCode.toDataURL(codigo, {
        width: 260,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
    }
  }

  protected imprimirEtiqueta(): void {
    if (!this.producto || !this.qrProductoDataUrl) {
      return;
    }

    const precio = Number(this.producto.precioVentaProd || 0).toFixed(2);

    const printWindow = window.open('', '_blank', 'width=420,height=640');

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Etiqueta ${this.producto.codigoBarraProd}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: #f1f5f9;
            color: #0f172a;
          }

          .label {
            width: 320px;
            margin: 0 auto;
            padding: 18px;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            background: #ffffff;
            text-align: center;
          }

          .brand {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
          }

          .name {
            margin: 8px 0 14px;
            font-size: 14px;
            color: #475569;
          }

          .qr {
            width: 220px;
            height: 220px;
            object-fit: contain;
            margin: 0 auto 12px;
            display: block;
          }

          .code {
            padding: 8px;
            border-radius: 10px;
            background: #f8fafc;
            font-size: 13px;
            word-break: break-all;
          }

          .price {
            margin-top: 10px;
            font-size: 18px;
            font-weight: 800;
            color: #16a34a;
          }

          .footer {
            margin-top: 10px;
            font-size: 11px;
            color: #64748b;
          }

          @media print {
            body {
              background: #ffffff;
              padding: 0;
            }

            .label {
              border: 1px solid #000;
              box-shadow: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="label">
          <h1 class="brand">SuperMarket</h1>
          <div class="name">${this.escapeHtml(this.producto.nombreProd)}</div>

          <img class="qr" src="${this.qrProductoDataUrl}" alt="QR producto" />

          <div class="code">
            Código: <strong>${this.escapeHtml(this.producto.codigoBarraProd)}</strong>
          </div>

          <div class="price">$${precio}</div>

          <div class="footer">
            Escanee este QR desde el POS para agregar el producto.
          </div>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  protected volver(): void {
    this.location.back();
  }
}
