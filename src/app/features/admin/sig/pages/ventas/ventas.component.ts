import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ISigCategoriaVendida,
  ISigFiltrosVentas,
  ISigProductoVendido,
  ISigResumenVentasPeriodo,
  ISigTendenciaVentas,
} from '@models';
import { SigService } from '@services/index';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sig-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss',
})
export default class VentasComponent implements OnInit {
  private readonly sigService = inject(SigService);

  protected resumen: ISigResumenVentasPeriodo | null = null;
  protected tendencia: ISigTendenciaVentas['items'] = [];
  protected productos: ISigProductoVendido[] = [];
  protected categorias: ISigCategoriaVendida[] = [];

  protected desde = '';
  protected hasta = '';
  protected limite = 10;

  protected cargando = true;
  protected mensajeError = '';
  protected ultimaConsulta: Date | null = null;

  protected readonly colores = [
    '#0f766e',
    '#4f46e5',
    '#d97706',
    '#0284c7',
    '#7c3aed',
    '#db2777',
  ];

  ngOnInit(): void {
    this.cargarAnalitica();
  }

  protected cargarAnalitica(): void {
    if (this.desde && this.hasta && this.desde > this.hasta) {
      this.mensajeError =
        'La fecha desde no puede ser posterior a la fecha hasta.';

      return;
    }

    const filtros: ISigFiltrosVentas = {
      desde: this.desde || undefined,
      hasta: this.hasta || undefined,
      limite: this.limite,
    };

    this.cargando = true;
    this.mensajeError = '';

    forkJoin({
      resumen: this.sigService.obtenerResumenVentas(filtros),

      tendencia: this.sigService.obtenerTendenciaVentas(filtros),

      productos: this.sigService.obtenerProductosMasVendidos(filtros),

      categorias: this.sigService.obtenerVentasPorCategoria(filtros),
    })
      .pipe(
        finalize(() => {
          this.cargando = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const respuestasValidas =
            response.resumen.success &&
            response.tendencia.success &&
            response.productos.success &&
            response.categorias.success;

          if (!respuestasValidas) {
            this.limpiarResultados();

            this.mensajeError =
              'La API SIG no devolvió una analítica de ventas válida.';

            return;
          }

          this.resumen = response.resumen.data;

          this.tendencia = response.tendencia.data.items ?? [];

          this.productos = response.productos.data.items ?? [];

          this.categorias = response.categorias.data.items ?? [];

          this.ultimaConsulta = new Date();
        },

        error: (error: unknown) => {
          this.limpiarResultados();

          this.mensajeError = this.obtenerMensajeError(error);
        },
      });
  }

  protected limpiarFiltros(): void {
    this.desde = '';
    this.hasta = '';
    this.limite = 10;

    this.cargarAnalitica();
  }

  protected alturaTendencia(total: number): number {
    const maximo = Math.max(0, ...this.tendencia.map((item) => item.total));

    if (maximo <= 0) {
      return 0;
    }

    return Math.max(8, (total / maximo) * 100);
  }

  protected porcentajeProducto(unidades: number): number {
    const maximo = Math.max(
      0,
      ...this.productos.map((item) => item.unidadesVendidas),
    );

    return maximo > 0 ? (unidades / maximo) * 100 : 0;
  }

  protected porcentajeCategoria(ingresos: number): number {
    const maximo = Math.max(0, ...this.categorias.map((item) => item.ingresos));

    return maximo > 0 ? (ingresos / maximo) * 100 : 0;
  }

  protected porcentajeCanal(totalCanal: number): number {
    const totalGeneral = this.resumen?.indicadores.totalVentas ?? 0;

    return totalGeneral > 0 ? (totalCanal / totalGeneral) * 100 : 0;
  }

  protected formatearFecha(fecha: string): string {
    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}`;
  }

  private limpiarResultados(): void {
    this.resumen = null;
    this.tendencia = [];
    this.productos = [];
    this.categorias = [];
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudo cargar la analítica de ventas.';
    }

    if (error.status === 0) {
      return (
        'No se pudo conectar con la API SIG. ' +
        'Comprueba que Go esté ejecutándose.'
      );
    }

    const detalle = error.error as {
      error?: string;
      message?: string;
    } | null;

    if (detalle?.error) {
      return detalle.error;
    }

    if (detalle?.message) {
      return detalle.message;
    }

    return (
      'No se pudo cargar la analítica de ventas. ' + `HTTP ${error.status}.`
    );
  }
}
