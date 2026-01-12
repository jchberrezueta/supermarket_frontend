import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { 
  DashboardService, 
  IDashboardStats, 
  IVentaMensual, 
  IProductoTop, 
  IVentaCategoria,
  IUltimaVenta,
  IPedidoReciente
} from '@services/index';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {
  public _authService = inject(AuthService);
  private readonly _dashboardService = inject(DashboardService);
  
  protected readonly username: string = '';
  protected stats: IDashboardStats | null = null;
  protected ventasMensuales: IVentaMensual[] = [];
  protected productosTop: IProductoTop[] = [];
  protected ventasPorCategoria: IVentaCategoria[] = [];
  protected ultimasVentas: IUltimaVenta[] = [];
  protected pedidosRecientes: IPedidoReciente[] = [];
  protected loading = true;
  protected currentDate = new Date();

  // Colores para gráficas
  protected chartColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
  ];

  constructor() {
    this.username = this._authService.getUser()?.username ?? '';
  }

  ngOnInit(): void {
    if( this._authService.getUserPerfil() === 'padmin'){
      this.loadDashboardData();
    }
    
  }

  private loadDashboardData(): void {
    forkJoin({
      stats: this._dashboardService.getEstadisticas(),
      ventasMensuales: this._dashboardService.getVentasMensuales(),
      productosTop: this._dashboardService.getProductosTop(),
      ventasPorCategoria: this._dashboardService.getVentasPorCategoria(),
      ultimasVentas: this._dashboardService.getUltimasVentas(),
      pedidosRecientes: this._dashboardService.getPedidosRecientes()
    }).subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.ventasMensuales = res.ventasMensuales || [];
        this.productosTop = res.productosTop || [];
        this.ventasPorCategoria = res.ventasPorCategoria || [];
        this.ultimasVentas = res.ultimasVentas || [];
        this.pedidosRecientes = res.pedidosRecientes || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading = false;
      }
    });
  }

  // Calcular altura de barra para gráfico de ventas mensuales
  getBarHeight(total: number): number {
    if (!this.ventasMensuales.length) return 0;
    const max = Math.max(...this.ventasMensuales.map(v => v.total));
    return max > 0 ? (total / max) * 100 : 0;
  }

  // Calcular porcentaje para gráfico de productos
  getProductPercentage(cantidad: number): number {
    if (!this.productosTop.length) return 0;
    const max = Math.max(...this.productosTop.map(p => p.cantidad));
    return max > 0 ? (cantidad / max) * 100 : 0;
  }

  // Calcular total de ventas por categoría
  getTotalVentasCategoria(): number {
    return this.ventasPorCategoria.reduce((sum, v) => sum + v.total, 0);
  }

  // Calcular porcentaje de categoría
  getCategoriaPercentage(total: number): number {
    const totalGeneral = this.getTotalVentasCategoria();
    return totalGeneral > 0 ? (total / totalGeneral) * 100 : 0;
  }

  // Obtener color de estado
  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'completo':
      case 'pagado':
        return 'estado-success';
      case 'progreso':
      case 'pendiente':
        return 'estado-warning';
      case 'incompleto':
      case 'cancelado':
        return 'estado-danger';
      default:
        return 'estado-default';
    }
  }
}

