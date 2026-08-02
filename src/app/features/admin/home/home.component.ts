import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';

import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { IInicioAcceso, IInicioResponse, IOpcionSidebar } from '@core/models';

import { AuthService } from '@core/services/auth.service';

import {
  DashboardService,
  IDashboardStats,
  IIotResumenBodega,
  IotService,
  IPedidoReciente,
  IProductoTop,
  IUltimaVenta,
  IVentaCategoria,
  IVentaMensual,
} from '@services/index';

import { finalize, forkJoin } from 'rxjs';

interface IAccesoRapido {
  id: number;
  titulo: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent implements OnInit, OnDestroy {
  public readonly authService = inject(AuthService);

  private readonly dashboardService = inject(DashboardService);

  private readonly iotService = inject(IotService);

  private readonly router = inject(Router);

  protected inicio: IInicioResponse | null = null;

  protected accesosRapidos: IAccesoRapido[] = [];

  protected stats: IDashboardStats | null = null;

  protected ventasMensuales: IVentaMensual[] = [];

  protected productosTop: IProductoTop[] = [];

  protected ventasPorCategoria: IVentaCategoria[] = [];

  protected ultimasVentas: IUltimaVenta[] = [];

  protected pedidosRecientes: IPedidoReciente[] = [];

  protected iotResumen: IIotResumenBodega | null = null;

  protected loadingInicio = true;

  protected loading = true;

  protected errorInicio: string | null = null;

  protected currentDate = new Date();

  protected readonly username: string;

  protected readonly chartColors = [
    '#6366f1',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  private iotIntervalId?: ReturnType<typeof setInterval>;

  private clockIntervalId?: ReturnType<typeof setInterval>;

  constructor() {
    this.username = this.authService.getUser()?.username ?? 'usuario';
  }

  ngOnInit(): void {
    this.accesosRapidos = this.construirAccesosRapidos(
      this.authService.getSidebarOptions(),
    );

    this.loadInicio();

    this.iniciarReloj();

    if (this.esAdministrador) {
      this.loadDashboardData();
      this.iniciarActualizacionIot();
    } else {
      this.loading = false;
    }
  }

  protected get esAdministrador(): boolean {
    return this.authService.getUserPerfil() === 'padmin';
  }

  protected get nombreBienvenida(): string {
    return this.inicio?.usuario.nombreEmpleado?.trim() || this.username;
  }

  protected get perfilBienvenida(): string {
    return (
      this.inicio?.usuario.perfil?.trim() ||
      this.formatearPerfil(this.authService.getUserPerfil())
    );
  }

  protected get saludo(): string {
    const hour = this.currentDate.getHours();

    if (hour < 12) {
      return 'Buenos días';
    }

    if (hour < 19) {
      return 'Buenas tardes';
    }

    return 'Buenas noches';
  }

  protected loadInicio(): void {
    if (this.loadingInicio) {
      this.errorInicio = null;
    }

    this.loadingInicio = true;

    this.authService
      .obtenerInicio()
      .pipe(
        finalize(() => {
          this.loadingInicio = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.inicio = response;
          this.errorInicio = null;
        },

        error: () => {
          this.inicio = null;

          this.errorInicio =
            'No fue posible consultar la información del último acceso.';
        },
      });
  }

  protected navegar(ruta: string): void {
    const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`;

    void this.router.navigateByUrl(rutaNormalizada);
  }

  protected formatFechaAcceso(value: string | null | undefined): string {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'No disponible';
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/.exec(
      text,
    );

    if (isoMatch) {
      const fecha = `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;

      if (isoMatch[4] && isoMatch[5]) {
        return `${fecha} ${isoMatch[4]}:${isoMatch[5]}`;
      }

      return fecha;
    }

    const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(
      text,
    );

    if (localMatch) {
      const fecha = `${localMatch[1]}/${localMatch[2]}/${localMatch[3]}`;

      if (localMatch[4] && localMatch[5]) {
        return `${fecha} ${localMatch[4]}:${localMatch[5]}`;
      }

      return fecha;
    }

    return text;
  }

  protected navegadorAmigable(
    acceso: IInicioAcceso | null | undefined,
  ): string {
    const navegador = acceso?.navegador?.trim();

    if (!navegador) {
      return 'No identificado';
    }

    if (/Edg\//i.test(navegador)) {
      return 'Microsoft Edge';
    }

    if (/OPR\//i.test(navegador)) {
      return 'Opera';
    }

    if (/Chrome\//i.test(navegador) && !/Edg\//i.test(navegador)) {
      return 'Google Chrome';
    }

    if (/Firefox\//i.test(navegador)) {
      return 'Mozilla Firefox';
    }

    if (/Safari\//i.test(navegador) && !/Chrome\//i.test(navegador)) {
      return 'Safari';
    }

    return navegador.length > 80 ? `${navegador.slice(0, 77)}...` : navegador;
  }

  protected getBarHeight(total: number): number {
    if (!this.ventasMensuales.length) {
      return 0;
    }

    const max = Math.max(...this.ventasMensuales.map((venta) => venta.total));

    return max > 0 ? (total / max) * 100 : 0;
  }

  protected getProductPercentage(cantidad: number): number {
    if (!this.productosTop.length) {
      return 0;
    }

    const max = Math.max(
      ...this.productosTop.map((producto) => producto.cantidad),
    );

    return max > 0 ? (cantidad / max) * 100 : 0;
  }

  protected getTotalVentasCategoria(): number {
    return this.ventasPorCategoria.reduce(
      (total, venta) => total + venta.total,
      0,
    );
  }

  protected getCategoriaPercentage(total: number): number {
    const totalGeneral = this.getTotalVentasCategoria();

    return totalGeneral > 0 ? (total / totalGeneral) * 100 : 0;
  }

  protected getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'completo':
      case 'pagado':
        return 'estado-success';

      case 'emitido':
      case 'parcial':
      case 'pendiente':
        return 'estado-warning';

      case 'cerrado_incompleto':
      case 'cancelado':
        return 'estado-danger';

      default:
        return 'estado-default';
    }
  }

  protected getIotEstadoClass(estado?: string): string {
    switch (estado) {
      case 'normal':
        return 'iot_normal';

      case 'alerta':
        return 'iot_alerta';

      case 'critico':
        return 'iot_critico';

      default:
        return 'iot_sin_datos';
    }
  }

  protected getIotEstadoLabel(estado?: string): string {
    switch (estado) {
      case 'normal':
        return 'Normal';

      case 'alerta':
        return 'Alerta';

      case 'critico':
        return 'Crítico';

      default:
        return 'Sin datos';
    }
  }

  ngOnDestroy(): void {
    if (this.iotIntervalId) {
      clearInterval(this.iotIntervalId);
    }

    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
    }
  }

  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      stats: this.dashboardService.getEstadisticas(),

      ventasMensuales: this.dashboardService.getVentasMensuales(),

      productosTop: this.dashboardService.getProductosTop(),

      ventasPorCategoria: this.dashboardService.getVentasPorCategoria(),

      ultimasVentas: this.dashboardService.getUltimasVentas(),

      pedidosRecientes: this.dashboardService.getPedidosRecientes(),
    }).subscribe({
      next: (response) => {
        this.stats = response.stats;

        this.ventasMensuales = response.ventasMensuales ?? [];

        this.productosTop = response.productosTop ?? [];

        this.ventasPorCategoria = response.ventasPorCategoria ?? [];

        this.ultimasVentas = response.ultimasVentas ?? [];

        this.pedidosRecientes = response.pedidosRecientes ?? [];

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  private iniciarActualizacionIot(): void {
    this.loadIotResumen();

    this.iotIntervalId = setInterval(() => {
      this.loadIotResumen();
    }, 10000);
  }

  private loadIotResumen(): void {
    this.iotService.getResumenBodega().subscribe({
      next: (response) => {
        this.iotResumen = response.data;
      },

      error: () => {
        this.iotResumen = null;
      },
    });
  }

  private iniciarReloj(): void {
    this.clockIntervalId = setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  private construirAccesosRapidos(opciones: IOpcionSidebar[]): IAccesoRapido[] {
    const accesos: IAccesoRapido[] = [];

    const rutasRegistradas = new Set<string>();

    const recorrer = (elementos: IOpcionSidebar[]): void => {
      for (const elemento of elementos ?? []) {
        const hijas = elemento.hijas ?? [];

        if (hijas.length > 0) {
          recorrer(hijas);
          continue;
        }

        const ruta = elemento.ruta?.trim();

        if (
          !ruta ||
          !elemento.visible ||
          elemento.activo?.trim().toLowerCase() === 'no' ||
          this.esRutaInicio(ruta) ||
          rutasRegistradas.has(ruta)
        ) {
          continue;
        }

        rutasRegistradas.add(ruta);

        accesos.push({
          id: elemento.id,
          titulo: elemento.titulo || 'Abrir módulo',
          ruta,
          icono: elemento.icono || 'apps',
        });
      }
    };

    recorrer(opciones ?? []);

    return accesos.slice(0, 6);
  }

  private esRutaInicio(ruta: string): boolean {
    const rutaNormalizada = ruta.replace(/^\/+/, '').replace(/\/+$/, '');

    return rutaNormalizada === 'admin/home';
  }

  private formatearPerfil(perfil: string | null): string {
    switch (perfil) {
      case 'padmin':
        return 'Administrador';

      case 'pbodega':
        return 'Bodega';

      case 'pventas':
        return 'Ventas';

      case 'pnomina':
        return 'Nómina';

      case 'pgerente':
        return 'Gerencia';

      default:
        return perfil
          ? perfil
              .replace(/^p/, '')
              .replaceAll('_', ' ')
              .replace(/^\w/, (letter) => letter.toUpperCase())
          : 'Perfil no identificado';
    }
  }
}
