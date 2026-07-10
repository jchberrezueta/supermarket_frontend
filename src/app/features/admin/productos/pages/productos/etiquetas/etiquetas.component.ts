import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IProductoResult } from '@models';
import { ProductosService } from '@services/index';
import { QrLabelComponent } from '@shared/components/qr-label/qr-label.component';
import * as QRCode from 'qrcode';

interface IProductoEtiqueta {
  ideProd: number;
  codigoBarraProd: string;
  nombreProd: string;
  precioVentaProd: number;
  stockProd: number;
  estadoProd: string;
  disponibleProd: 'si' | 'no';
  seleccionado: boolean;
  copias: number;
}

interface IEtiquetaPrint {
  nombreProd: string;
  codigoBarraProd: string;
  precioVentaProd: number;
  qrDataUrl: string;
}

@Component({
  selector: 'app-etiquetas-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, QrLabelComponent],
  providers: [CurrencyPipe],
  templateUrl: './etiquetas.component.html',
  styleUrl: './etiquetas.component.scss',
})
export default class EtiquetasComponent {
  private readonly productosService = inject(ProductosService);
  private readonly currencyPipe = inject(CurrencyPipe);

  protected productos: IProductoEtiqueta[] = [];
  protected filtro = '';

  protected cargando = false;
  protected imprimiendo = false;

  protected successMessage = '';
  protected errorMessage = '';

  constructor() {
    this.cargarProductos();
  }

  protected cargarProductos(): void {
    this.cargando = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.productosService.listar().subscribe({
      next: (resp) => {
        this.productos = (resp.data || [])
          .map((producto) => this.mapProducto(producto))
          .filter((producto) => !!producto.codigoBarraProd);

        this.cargando = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los productos.';
        this.cargando = false;
      },
    });
  }

  protected get productosFiltrados(): IProductoEtiqueta[] {
    const termino = this.filtro.trim().toLowerCase();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter((producto) => {
      return (
        producto.nombreProd.toLowerCase().includes(termino) ||
        producto.codigoBarraProd.toLowerCase().includes(termino)
      );
    });
  }

  protected get productosSeleccionados(): IProductoEtiqueta[] {
    return this.productos.filter((producto) => producto.seleccionado);
  }

  protected get totalEtiquetas(): number {
    return this.productosSeleccionados.reduce(
      (total, producto) => total + producto.copias,
      0,
    );
  }

  protected seleccionarTodosVisibles(): void {
    this.productosFiltrados.forEach((producto) => {
      producto.seleccionado = true;

      if (!producto.copias || producto.copias < 1) {
        producto.copias = 1;
      }
    });
  }

  protected limpiarSeleccion(): void {
    this.productos.forEach((producto) => {
      producto.seleccionado = false;
      producto.copias = 1;
    });

    this.successMessage = '';
    this.errorMessage = '';
  }

  protected normalizarCopias(producto: IProductoEtiqueta): void {
    if (!producto.copias || producto.copias < 1) {
      producto.copias = 1;
    }

    if (producto.copias > 50) {
      producto.copias = 50;
    }
  }

  protected async imprimirEtiquetas(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.productosSeleccionados.length === 0) {
      this.errorMessage = 'Seleccione al menos un producto para imprimir.';
      return;
    }

    this.imprimiendo = true;

    try {
      const etiquetas = await this.generarEtiquetasPrint();

      const printWindow = window.open('', '_blank', 'width=900,height=700');

      if (!printWindow) {
        this.errorMessage =
          'No se pudo abrir la ventana de impresión. Verifique el bloqueador de ventanas.';
        this.imprimiendo = false;
        return;
      }

      printWindow.document.write(this.buildPrintHtml(etiquetas));
      printWindow.document.close();

      this.successMessage = 'Hoja de etiquetas generada correctamente.';
    } catch (error) {
      this.errorMessage = 'No se pudieron generar las etiquetas.';
    } finally {
      this.imprimiendo = false;
    }
  }

  private async generarEtiquetasPrint(): Promise<IEtiquetaPrint[]> {
    const etiquetas: IEtiquetaPrint[] = [];

    for (const producto of this.productosSeleccionados) {
      const qrDataUrl = await QRCode.toDataURL(producto.codigoBarraProd, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: 'M',
      });

      for (let i = 0; i < producto.copias; i++) {
        etiquetas.push({
          nombreProd: producto.nombreProd,
          codigoBarraProd: producto.codigoBarraProd,
          precioVentaProd: producto.precioVentaProd,
          qrDataUrl,
        });
      }
    }

    return etiquetas;
  }

  private buildPrintHtml(etiquetas: IEtiquetaPrint[]): string {
    const etiquetasHtml = etiquetas
      .map((etiqueta) => {
        const precio = this.currencyPipe.transform(
          etiqueta.precioVentaProd,
          'USD',
          'symbol',
          '1.2-2',
        );

        return `
          <article class="label">
            <h2>SuperMarket</h2>
            <p class="product-name">${this.escapeHtml(etiqueta.nombreProd)}</p>

            <img src="${etiqueta.qrDataUrl}" alt="QR producto" />

            <p class="code">
              Código:
              <strong>${this.escapeHtml(etiqueta.codigoBarraProd)}</strong>
            </p>

            <p class="price">${precio || '$0.00'}</p>
          </article>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas de productos</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 16px;
              font-family: Arial, sans-serif;
              background: #ffffff;
              color: #0f172a;
            }

            .sheet {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
            }

            .label {
              min-height: 260px;
              padding: 12px;
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              text-align: center;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .label h2 {
              margin: 0;
              font-size: 16px;
              font-weight: 800;
            }

            .product-name {
              min-height: 34px;
              margin: 6px 0 8px;
              font-size: 12px;
              color: #475569;
            }

            .label img {
              width: 135px;
              height: 135px;
              object-fit: contain;
              display: block;
              margin: 0 auto;
            }

            .code {
              margin: 8px 0 0;
              padding: 6px;
              border-radius: 8px;
              background: #f8fafc;
              font-size: 11px;
              word-break: break-all;
            }

            .price {
              margin: 8px 0 0;
              font-size: 16px;
              font-weight: 800;
              color: #16a34a;
            }

            @page {
              size: A4;
              margin: 12mm;
            }

            @media print {
              body {
                padding: 0;
              }

              .sheet {
                gap: 8px;
              }

              .label {
                border: 1px solid #000;
                border-radius: 0;
              }
            }
          </style>
        </head>

        <body>
          <main class="sheet">
            ${etiquetasHtml}
          </main>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;
  }

  private mapProducto(producto: IProductoResult): IProductoEtiqueta {
    return {
      ideProd: producto.ide_prod,
      codigoBarraProd: producto.codigo_barra_prod,
      nombreProd: producto.nombre_prod,
      precioVentaProd: Number(producto.precio_venta_prod || 0),
      stockProd: Number(producto.stock_prod || 0),
      estadoProd: producto.estado_prod,
      disponibleProd: producto.disponible_prod,
      seleccionado: false,
      copias: 1,
    };
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
