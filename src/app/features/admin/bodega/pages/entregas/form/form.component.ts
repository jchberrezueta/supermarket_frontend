import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

import {
  EnumEstadoDetalleEntrega,
  EnumEstadoEntrega,
  IDetalleEntregaResult,
  IEntregaCompleta,
  IEntregaResult,
  ILineaPedidoPendiente,
  ILoteEntregaBorrador,
  IPedidoEntregaPendiente,
} from '@models';
import { EntregasService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { LoadingService } from '@shared/services/loading.service';

interface ILineaEntregaLocal extends ILineaPedidoPendiente {
  claveLocal: string;
  cantidadProd: number;
  estadoDetaEntr: EnumEstadoDetalleEntrega;
  lotesRecibidos: ILoteEntregaBorrador[];
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UiButtonComponent, UiComboBoxComponent, UiDatetimePickerComponent, UiTextAreaComponent, UiTextFieldComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly entregasService = inject(EntregasService);
  private readonly loadingService = inject(LoadingService);
  private readonly fb = inject(FormBuilder);

  protected pedidos: IComboBoxOption[] = [];
  protected proveedores: IComboBoxOption[] = [];
  protected pedidoInfo: IPedidoEntregaPendiente | null = null;
  protected detalles: ILineaEntregaLocal[] = [];
  protected isAdd = true;
  protected idEntrega = -1;
  protected guardando = false;
  protected claveEdicion: string | null = null;
  protected cantidadEdicion = 0;
  protected lotesEdicion: ILoteEntregaBorrador[] = [];
  protected fechaLote = '';
  protected cantidadLote = 1;
  protected indiceLoteEdicion: number | null = null;
  private entregaCargada: IEntregaResult | null = null;
  protected readonly fechaMinimaReemplazo = this.calcularFechaMinimaReemplazo();

  protected readonly formData = this.fb.group({
    idePedi: [-1, [Validators.required, Validators.min(1)]],
    ideProv: [-1, [Validators.required, Validators.min(1)]],
    fechaEntr: ['', Validators.required],
    observacionEntr: [''],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.isAdd = !(Number.isInteger(id) && id > 0);
    this.idEntrega = this.isAdd ? -1 : id;
    this.entregasService.listarPedidosDisponibles().subscribe({
      next: (res) => {
        this.pedidos = (res.data ?? []).map((pedido) => ({ value: pedido.ide_pedi, label: pedido.label }));
        if (!this.isAdd) this.cargarBorrador();
      },
      error: () => this.alerta('No se pudieron cargar los pedidos', 'Intente nuevamente.', 'error'),
    });
  }

  protected seleccionarPedido(value: string | number): void {
    if (!this.isAdd) return;
    const idePedi = Number(value);
    this.formData.controls.idePedi.setValue(idePedi);
    this.cargarPedido(idePedi);
  }

  protected editarLinea(linea: ILineaEntregaLocal): void {
    this.claveEdicion = linea.claveLocal;
    this.cantidadEdicion = linea.cantidadProd;
    this.lotesEdicion = linea.lotesRecibidos.map((lote) => ({ ...lote }));
    this.limpiarCapturaLote();
  }

  protected cambiarCantidadEdicion(value: number): void {
    this.cantidadEdicion = Number(value);
    if (this.cantidadEdicion === 0) this.lotesEdicion = [];
  }

  protected agregarLote(): void {
    const fecha = this.fechaLote;
    const cantidad = Number(this.cantidadLote);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isInteger(cantidad) || cantidad <= 0) {
      this.alerta('Distribución inválida', 'Ingrese una fecha y una cantidad entera mayor que cero.');
      return;
    }
    if (this.esCanje && fecha < this.fechaMinimaReemplazo) {
      this.alerta(
        'Caducidad inválida',
        `El lote de reemplazo debe caducar desde ${this.fechaMinimaReemplazo} en adelante.`,
      );
      return;
    }
    if (this.lotesEdicion.some((lote, i) => lote.fechaCaducidadLote === fecha && i !== this.indiceLoteEdicion)) {
      this.alerta('Fecha repetida', 'No puede repetir una fecha de caducidad dentro de la misma línea.');
      return;
    }
    const lote = { fechaCaducidadLote: fecha, cantidadLote: cantidad };
    if (this.indiceLoteEdicion === null) this.lotesEdicion = [...this.lotesEdicion, lote];
    else this.lotesEdicion = this.lotesEdicion.map((actual, i) => i === this.indiceLoteEdicion ? lote : actual);
    this.limpiarCapturaLote();
  }

  protected editarLote(indice: number): void {
    const lote = this.lotesEdicion[indice];
    this.indiceLoteEdicion = indice;
    this.fechaLote = lote.fechaCaducidadLote;
    this.cantidadLote = lote.cantidadLote;
  }

  protected quitarLote(indice: number): void {
    this.lotesEdicion = this.lotesEdicion.filter((_, i) => i !== indice);
    this.limpiarCapturaLote();
  }

  protected guardarCambiosLinea(): void {
    const linea = this.lineaEditada;
    if (!linea) return;
    if (!Number.isInteger(this.cantidadEdicion) || this.cantidadEdicion < 0 || this.cantidadEdicion > linea.cantidadPendiente) {
      this.alerta('Cantidad inválida', `Ingrese una cantidad entera entre 0 y ${linea.cantidadPendiente}.`);
      return;
    }
    if (this.cantidadEdicion > 0 && (!this.lotesEdicion.length || this.totalLotesEdicion !== this.cantidadEdicion)) {
      this.alerta('Distribución incompleta', 'La suma de las distribuciones debe coincidir con lo recibido ahora.');
      return;
    }
    const actualizado: ILineaEntregaLocal = {
      ...linea,
      cantidadProd: this.cantidadEdicion,
      lotesRecibidos: this.cantidadEdicion === 0 ? [] : this.lotesEdicion.map((lote) => ({ ...lote })),
      estadoDetaEntr: this.estadoCalculado(this.cantidadEdicion, linea.cantidadPendiente),
    };
    this.detalles = this.detalles.map((item) => item.claveLocal === linea.claveLocal ? actualizado : item);
    this.cancelarEdicionLinea();
  }

  protected cancelarEdicionLinea(): void {
    this.claveEdicion = null;
    this.cantidadEdicion = 0;
    this.lotesEdicion = [];
    this.limpiarCapturaLote();
  }

  protected guardar(): void {
    if (this.claveEdicion) {
      this.alerta('Edición pendiente', 'Guarde o cancele la edición de la fila antes de continuar.');
      return;
    }
    if (this.formData.invalid || !this.detalles.length || this.detalles.some((linea) => !this.lineaValida(linea))) {
      this.alerta('Datos incompletos', 'Revise pedido, proveedor, fecha real, cantidades y distribuciones.');
      return;
    }
    const payload: IEntregaCompleta = {
      cabeceraEntrega: {
        idePedi: Number(this.formData.controls.idePedi.value),
        ideProv: Number(this.formData.controls.ideProv.value),
        fechaEntr: this.formData.controls.fechaEntr.value!,
        observacionEntr: this.formData.controls.observacionEntr.value?.trim() || null,
      },
      detalleEntrega: this.detalles.map((linea) => ({
        ideDetaPedi: linea.ideDetaPedi,
        cantidadProd: linea.cantidadProd,
        lotesRecibidos: linea.lotesRecibidos.map((lote) => ({ ...lote })),
      })),
    };
    const request = this.isAdd ? this.entregasService.insertar(payload) : this.entregasService.actualizar(this.idEntrega, payload);
    this.guardando = true;
    this.loadingService.show();
    request.pipe(finalize(() => { this.guardando = false; this.loadingService.hide(); })).subscribe({
      next: (res) => {
        if (Number(res?.p_result) !== 1) {
          this.alerta('No se pudo guardar', res?.p_response ?? 'Revise los datos ingresados.', 'error');
          return;
        }
        Swal.fire({ icon: 'success', title: this.isAdd ? 'Borrador registrado' : 'Borrador actualizado', text: res?.p_response })
          .then(() => this.router.navigate(['/admin/bodega/entregas/list']));
      },
      error: (error) => this.alerta('No se pudo guardar', error?.error?.message ?? 'Ocurrió un error.', 'error'),
    });
  }

  protected cancelar(): void { this.router.navigate(['/admin/bodega/entregas/list']); }
  protected get lineaEditada(): ILineaEntregaLocal | null { return this.detalles.find((linea) => linea.claveLocal === this.claveEdicion) ?? null; }
  protected get totalLotesEdicion(): number { return this.lotesEdicion.reduce((suma, lote) => suma + Number(lote.cantidadLote), 0); }
  protected get cantidadTotal(): number { return this.detalles.reduce((suma, linea) => suma + linea.cantidadProd, 0); }
  protected get esCanje(): boolean { return this.pedidoInfo?.motivoPedi === 'devolucion'; }
  protected get nombreProceso(): string { return this.esCanje ? 'Canje por caducidad' : 'Petición normal'; }
  protected get totalEconomico(): number { return this.redondear(this.detalles.reduce((suma, linea) => suma + this.importeLinea(linea), 0)); }
  protected get puntualidad(): 'anticipada' | 'tiempo' | 'atrasada' | null {
    const real = this.formData.controls.fechaEntr.value;
    const esperada = this.pedidoInfo?.fechaEntrPedi;
    if (!real || !esperada) return null;
    return real < esperada ? 'anticipada' : real === esperada ? 'tiempo' : 'atrasada';
  }

  protected importeLinea(linea: ILineaEntregaLocal): number {
    return linea.cantidadSolicitada > 0 ? this.redondear(linea.totalProd * linea.cantidadProd / linea.cantidadSolicitada) : 0;
  }

  private cargarBorrador(): void {
    this.loadingService.show();
    this.entregasService.buscar(this.idEntrega).subscribe({
      next: (res) => {
        const entrega = res.data?.[0];
        if (!entrega || entrega.estado_entr !== EnumEstadoEntrega.BORRADOR) {
          this.loadingService.hide();
          this.alerta('Entrega no editable', 'Solo las entregas en borrador pueden editarse.', 'error');
          this.cancelar();
          return;
        }
        this.entregaCargada = entrega;
        if (!this.pedidos.some((pedido) => Number(pedido.value) === entrega.ide_pedi)) {
          this.pedidos = [{ value: entrega.ide_pedi, label: `Pedido #${entrega.ide_pedi} · ${entrega.nombre_empr ?? 'Empresa'}` }, ...this.pedidos];
        }
        this.formData.patchValue({ idePedi: entrega.ide_pedi, ideProv: entrega.ide_prov, fechaEntr: entrega.fecha_entr.slice(0, 10), observacionEntr: entrega.observacion_entr ?? '' });
        this.cargarPedido(entrega.ide_pedi, entrega.detalles ?? []);
      },
      error: () => { this.loadingService.hide(); this.alerta('No se pudo cargar la entrega', 'Intente nuevamente.', 'error'); },
    });
  }

  private cargarPedido(idePedi: number, guardados: IDetalleEntregaResult[] = []): void {
    this.loadingService.show();
    this.entregasService.obtenerPedidoPendiente(idePedi).subscribe({
      next: (res) => {
        this.pedidoInfo = res.data?.[0] ?? null;
        if (!this.pedidoInfo) return;
        const porDetalle = new Map(guardados.map((detalle) => [detalle.ide_deta_pedi, detalle]));
        this.detalles = this.pedidoInfo.detalles.map((linea) => {
          const guardado = porDetalle.get(linea.ideDetaPedi);
          const cantidad = Number(guardado?.cantidad_prod ?? 0);
          return {
            ...linea,
            claveLocal: `pedido-${linea.ideDetaPedi}`,
            cantidadProd: cantidad,
            estadoDetaEntr: this.estadoCalculado(cantidad, linea.cantidadPendiente),
            lotesRecibidos: (guardado?.lotes_recibidos ?? []).map((lote) => ({ fechaCaducidadLote: lote.fecha_caducidad_lote, cantidadLote: lote.cantidad_lote })),
          };
        });
        this.formData.controls.ideProv.setValue(this.entregaCargada?.ide_prov ?? -1);
        this.cargarProveedores(this.pedidoInfo.ideEmpr);
      },
      error: () => this.alerta('Pedido no disponible', 'El pedido no admite entregas en este proceso.', 'error'),
      complete: () => this.loadingService.hide(),
    });
  }

  private cargarProveedores(ideEmpr: number): void {
    this.entregasService.listarProveedoresEmpresa(ideEmpr).subscribe((proveedores) => this.proveedores = proveedores ?? []);
  }

  protected estadoCalculado(cantidad: number, pendiente: number): EnumEstadoDetalleEntrega {
    if (cantidad === 0) return EnumEstadoDetalleEntrega.NO_ENTREGADO;
    return cantidad === pendiente ? EnumEstadoDetalleEntrega.COMPLETO : EnumEstadoDetalleEntrega.INCOMPLETO;
  }

  private lineaValida(linea: ILineaEntregaLocal): boolean {
    if (!Number.isInteger(linea.cantidadProd) || linea.cantidadProd < 0 || linea.cantidadProd > linea.cantidadPendiente) return false;
    if (linea.cantidadProd === 0) return linea.lotesRecibidos.length === 0;
    const fechas = new Set(linea.lotesRecibidos.map((lote) => lote.fechaCaducidadLote));
    return linea.lotesRecibidos.length > 0 && fechas.size === linea.lotesRecibidos.length
      && linea.lotesRecibidos.every((lote) =>
        /^\d{4}-\d{2}-\d{2}$/.test(lote.fechaCaducidadLote)
        && Number.isInteger(lote.cantidadLote)
        && lote.cantidadLote > 0
        && (!this.esCanje || lote.fechaCaducidadLote >= this.fechaMinimaReemplazo))
      && linea.lotesRecibidos.reduce((suma, lote) => suma + lote.cantidadLote, 0) === linea.cantidadProd;
  }

  private calcularFechaMinimaReemplazo(): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private limpiarCapturaLote(): void { this.fechaLote = ''; this.cantidadLote = 1; this.indiceLoteEdicion = null; }
  private redondear(value: number): number { return Math.round((value + Number.EPSILON) * 100) / 100; }
  private alerta(title: string, text: string, icon: 'info' | 'error' = 'info'): void { void Swal.fire({ icon, title, text }); }
}
