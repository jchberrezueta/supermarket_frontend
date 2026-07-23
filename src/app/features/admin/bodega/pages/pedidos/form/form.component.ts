import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

import { EnumMotivosPedido, IDetallePedidoResult, IEmpresaPreciosResult, IPedidoCompleto, IPedidoResult } from '@models';
import { EmpresasService, PedidosService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { LoadingService } from '@shared/services/loading.service';

interface IDetalleTabla {
  claveLocal: string;
  ideProd: number;
  nombreProd: string;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  ivaProd: number;
  dctoCompraProd: number;
  dctoCaducProd: number;
  totalProd: number;
}

interface IPrevisualizacion extends Omit<IDetalleTabla, 'claveLocal' | 'ideProd' | 'nombreProd' | 'cantidadProd'> {}

const VACIO: IPrevisualizacion = {
  precioUnitarioProd: 0,
  subtotalProd: 0,
  ivaProd: 0,
  dctoCompraProd: 0,
  dctoCaducProd: 0,
  totalProd: 0,
};

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UiTextFieldComponent, UiTextAreaComponent, UiComboBoxComponent, UiButtonComponent, UiDatetimePickerComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pedidosService = inject(PedidosService);
  private readonly empresasService = inject(EmpresasService);
  private readonly loadingService = inject(LoadingService);
  private readonly fb = inject(FormBuilder);

  protected readonly motivos: IComboBoxOption[] = [
    { value: EnumMotivosPedido.PETICION, label: 'Petición' },
    { value: EnumMotivosPedido.DEVOLUCION, label: 'Devolución' },
  ];
  protected empresas: IComboBoxOption[] = [];
  protected productos: IComboBoxOption[] = [];
  protected preciosEmpresa: IEmpresaPreciosResult[] = [];
  protected detalles: IDetalleTabla[] = [];
  protected productoSeleccionado = -1;
  protected cantidadProducto = 1;
  protected preview: IPrevisualizacion = { ...VACIO };
  protected fechaPedidoVisible = this.formatearFecha(new Date());
  protected fechaPedidoCalendario = this.fechaCalendarioLocal(new Date());
  protected cabeceraConfirmada = false;
  protected cargandoProductos = false;
  protected guardando = false;
  protected isAdd = true;
  protected idPedido = -1;
  protected claveEdicion: string | null = null;
  private secuenciaLocal = 0;

  protected readonly formData = this.fb.group({
    ideEmpr: [-1, [Validators.required, Validators.min(1)]],
    motivoPedi: ['', Validators.required],
    fechaEntrPedi: ['', Validators.required],
    observacionPedi: [''],
  });

  ngOnInit(): void {
    this.empresasService.listarComboEmpresas().subscribe((res) => this.empresas = res ?? []);
    const id = Number(this.route.snapshot.params['id']);
    if (Number.isInteger(id) && id > 0) {
      this.cargarBorrador(id);
    }
  }

  protected seleccionarEmpresa(value: string | number): void {
    if (this.cabeceraConfirmada || this.detalles.length > 0) return;
    const ideEmpr = Number(value);
    this.formData.controls.ideEmpr.setValue(ideEmpr);
    this.limpiarSeleccionProducto();
    this.cargarProductosEmpresa(ideEmpr);
  }

  protected seleccionarMotivo(value: string): void {
    if (this.cabeceraConfirmada || this.detalles.length > 0) return;
    this.formData.controls.motivoPedi.setValue(value);
    this.actualizarPreview();
  }

  protected confirmarCabecera(): void {
    if (this.formData.controls.ideEmpr.invalid || this.formData.controls.motivoPedi.invalid || this.formData.controls.fechaEntrPedi.invalid) {
      this.alerta('Cabecera incompleta', 'Seleccione la empresa proveedora, el motivo y la fecha esperada de entrega.');
      return;
    }
    if (this.formData.controls.fechaEntrPedi.value! < this.fechaPedidoCalendario) {
      this.alerta('Fecha esperada inválida', 'La fecha esperada de entrega no puede ser anterior a la fecha del pedido.');
      return;
    }
    this.cabeceraConfirmada = true;
  }

  protected editarCabecera(): void {
    this.cabeceraConfirmada = false;
  }

  protected seleccionarProducto(value: string | number): void {
    this.productoSeleccionado = Number(value);
    this.actualizarPreview();
  }

  protected cambiarCantidad(value: number): void {
    this.cantidadProducto = Number(value);
    this.actualizarPreview();
  }

  protected agregarProducto(): void {
    if (this.claveEdicion) {
      this.guardarCambiosProducto();
      return;
    }
    if (!this.cabeceraConfirmada) this.confirmarCabecera();
    if (!this.cabeceraConfirmada) return;
    if (!Number.isInteger(this.cantidadProducto) || this.cantidadProducto <= 0) {
      this.alerta('Cantidad inválida', 'Ingrese una cantidad entera mayor que cero.');
      return;
    }
    const precio = this.precioSeleccionado;
    if (!precio || Number(precio.ide_empr) !== Number(this.formData.controls.ideEmpr.value)) {
      this.alerta('Producto inválido', 'Seleccione un producto ofrecido por la empresa.');
      return;
    }
    if (this.detalles.some((detalle) => detalle.ideProd === precio.ide_prod)) {
      this.alerta('Producto duplicado', 'Cada producto solo puede aparecer una vez en el pedido.');
      return;
    }
    if (this.preview.dctoCompraProd + this.preview.dctoCaducProd > this.preview.subtotalProd) {
      this.alerta('Descuentos inválidos', 'Los descuentos no pueden superar el subtotal bruto.');
      return;
    }
    this.detalles = [...this.detalles, {
      claveLocal: this.crearClaveLocal(),
      ideProd: precio.ide_prod,
      nombreProd: precio.nombre_prod ?? `Producto #${precio.ide_prod}`,
      cantidadProd: this.cantidadProducto,
      ...this.preview,
    }];
    this.cabeceraConfirmada = true;
    this.limpiarSeleccionProducto();
  }

  protected editarProducto(detalle: IDetalleTabla): void {
    this.claveEdicion = detalle.claveLocal;
    this.productoSeleccionado = detalle.ideProd;
    this.cantidadProducto = detalle.cantidadProd;
    this.actualizarPreview();
  }

  protected guardarCambiosProducto(): void {
    const clave = this.claveEdicion;
    if (!clave) return;
    const indice = this.detalles.findIndex((detalle) => detalle.claveLocal === clave);
    if (indice < 0) {
      this.cancelarEdicionProducto();
      return;
    }
    if (!Number.isInteger(this.cantidadProducto) || this.cantidadProducto <= 0) {
      this.alerta('Cantidad inválida', 'Ingrese una cantidad entera mayor que cero.');
      return;
    }
    const precio = this.precioSeleccionado;
    if (!precio || Number(precio.ide_empr) !== Number(this.formData.controls.ideEmpr.value)) {
      this.alerta('Producto inválido', 'Seleccione un producto ofrecido por la empresa.');
      return;
    }
    if (this.detalles.some((detalle) => detalle.claveLocal !== clave && detalle.ideProd === precio.ide_prod)) {
      this.alerta('Producto duplicado', 'Cada producto solo puede aparecer una vez en el pedido.');
      return;
    }
    if (this.preview.dctoCompraProd + this.preview.dctoCaducProd > this.preview.subtotalProd) {
      this.alerta('Descuentos inválidos', 'Los descuentos no pueden superar el subtotal bruto.');
      return;
    }
    const actualizado: IDetalleTabla = {
      claveLocal: clave,
      ideProd: precio.ide_prod,
      nombreProd: precio.nombre_prod ?? `Producto #${precio.ide_prod}`,
      cantidadProd: this.cantidadProducto,
      ...this.preview,
    };
    this.detalles = this.detalles.map((detalle, itemIndex) => itemIndex === indice ? actualizado : detalle);
    this.cancelarEdicionProducto();
  }

  protected cancelarEdicionProducto(): void {
    this.claveEdicion = null;
    this.limpiarSeleccionProducto();
  }

  protected eliminarProducto(claveLocal: string): void {
    this.detalles = this.detalles.filter((detalle) => detalle.claveLocal !== claveLocal);
    if (this.claveEdicion === claveLocal) this.cancelarEdicionProducto();
  }

  protected guardar(): void {
    if (this.claveEdicion) {
      this.alerta('Edición de producto pendiente', 'Guarde o cancele la edición del producto antes de continuar.');
      return;
    }
    this.confirmarCabecera();
    if (!this.cabeceraConfirmada || !this.detalles.length || this.guardando) {
      if (!this.detalles.length) this.alerta('Sin productos', 'Debe agregar al menos un producto al pedido.');
      return;
    }
    const payload = this.construirPayload();
    const request = this.isAdd
      ? this.pedidosService.insertar(payload)
      : this.pedidosService.actualizar(this.idPedido, payload);
    this.guardando = true;
    this.loadingService.show();
    request.pipe(finalize(() => {
      this.guardando = false;
      this.loadingService.hide();
    })).subscribe({
      next: (res) => {
        if (Number(res?.p_result) !== 1) {
          this.alerta('No se pudo guardar', this.mensajeRespuesta(res?.p_response, 'Revise la información del pedido.'), 'error');
          return;
        }
        Swal.fire({ icon: 'success', title: this.isAdd ? 'Borrador guardado' : 'Borrador actualizado' })
          .then(() => this.router.navigate(['/admin/bodega/pedidos/list']));
      },
      error: (error) => this.alerta('No se pudo guardar', error?.error?.message ?? 'Ocurrió un error al guardar el borrador.', 'error'),
    });
  }

  protected cancelar(): void {
    this.router.navigate(['/admin/bodega/pedidos/list']);
  }

  protected get cantidadTotal(): number { return this.detalles.reduce((sum, d) => sum + d.cantidadProd, 0); }
  protected get esDevolucion(): boolean { return this.formData.controls.motivoPedi.value === EnumMotivosPedido.DEVOLUCION; }
  protected get subtotalTotal(): number { return this.redondear(this.detalles.reduce((sum, d) => sum + d.subtotalProd, 0)); }
  protected get descuentosTotal(): number { return this.redondear(this.detalles.reduce((sum, d) => sum + d.dctoCompraProd + d.dctoCaducProd, 0)); }
  protected get ivaTotal(): number { return this.redondear(this.detalles.reduce((sum, d) => sum + d.ivaProd, 0)); }
  protected get totalGeneral(): number { return this.redondear(this.detalles.reduce((sum, d) => sum + d.totalProd, 0)); }

  private cargarBorrador(id: number): void {
    this.isAdd = false;
    this.idPedido = id;
    this.loadingService.show();
    this.pedidosService.buscar(id).subscribe({
      next: (res) => {
        const pedido = res.data?.[0] as IPedidoResult | undefined;
        if (!pedido || pedido.estado_pedi !== 'borrador') {
          this.loadingService.hide();
          this.alerta('Pedido no editable', 'Solo los pedidos en borrador pueden editarse.', 'error');
          this.router.navigate(['/admin/bodega/pedidos/list']);
          return;
        }
        this.fechaPedidoVisible = pedido.fecha_pedi;
        this.fechaPedidoCalendario = this.extraerFechaCalendario(pedido.fecha_pedi);
        this.formData.patchValue({ ideEmpr: pedido.ide_empr, motivoPedi: pedido.motivo_pedi, fechaEntrPedi: pedido.fecha_entr_pedi ?? '', observacionPedi: pedido.observacion_pedi ?? '' });
        this.cargarProductosEmpresa(pedido.ide_empr, () => this.cargarDetalles(id));
      },
      error: () => this.loadingService.hide(),
    });
  }

  private cargarProductosEmpresa(ideEmpr: number, completado?: () => void): void {
    if (!Number.isInteger(ideEmpr) || ideEmpr <= 0) return;
    this.cargandoProductos = true;
    this.empresasService.listarPreciosProductosEmpresa(ideEmpr).pipe(finalize(() => this.cargandoProductos = false)).subscribe({
      next: (res) => {
        const unicos = new Map<number, IEmpresaPreciosResult>();
        for (const precio of res.data ?? []) {
          if (precio.ide_prod > 0 && precio.nombre_prod && precio.estado_prod === 'activo' && !unicos.has(precio.ide_prod)) unicos.set(precio.ide_prod, precio);
        }
        this.preciosEmpresa = [...unicos.values()];
        this.productos = this.preciosEmpresa.map((precio) => ({ value: precio.ide_prod, label: precio.nombre_prod! }));
        completado?.();
      },
      error: () => {
        this.preciosEmpresa = [];
        this.productos = [];
        completado?.();
      },
    });
  }

  private cargarDetalles(id: number): void {
    this.pedidosService.listarDetallesPedido(id).pipe(finalize(() => this.loadingService.hide())).subscribe({
      next: (res) => {
        this.detalles = ((res.data ?? []) as unknown as IDetallePedidoResult[]).map((detalle) => ({
          claveLocal: `persistida-${detalle.ide_deta_pedi}`,
          ideProd: detalle.ide_prod,
          nombreProd: detalle.nombre_prod ?? this.preciosEmpresa.find((p) => p.ide_prod === detalle.ide_prod)?.nombre_prod ?? `Producto #${detalle.ide_prod}`,
          cantidadProd: detalle.cantidad_prod,
          precioUnitarioProd: detalle.precio_unitario_prod,
          subtotalProd: this.redondear(detalle.precio_unitario_prod * detalle.cantidad_prod),
          ivaProd: detalle.iva_prod,
          dctoCompraProd: detalle.dcto_compra_prod,
          dctoCaducProd: detalle.dcto_caduc_prod,
          totalProd: detalle.total_prod,
        }));
        this.cabeceraConfirmada = this.detalles.length > 0;
      },
    });
  }

  private get precioSeleccionado(): IEmpresaPreciosResult | undefined {
    return this.preciosEmpresa.find((precio) => precio.ide_prod === this.productoSeleccionado);
  }

  private actualizarPreview(): void {
    const precio = this.precioSeleccionado;
    const cantidad = Number(this.cantidadProducto);
    if (!precio || !Number.isFinite(cantidad) || cantidad <= 0) {
      this.preview = { ...VACIO };
      return;
    }
    const subtotal = this.redondear(Number(precio.precio_compra_prod) * cantidad);
    const dctoCompra = this.redondear(Number(precio.dcto_compra_prod) * cantidad);
    const dctoCaduc = this.formData.controls.motivoPedi.value === EnumMotivosPedido.DEVOLUCION
      ? this.redondear(Number(precio.dcto_caducidad_prod) * cantidad) : 0;
    const neto = this.redondear(subtotal - dctoCompra - dctoCaduc);
    const iva = this.redondear(neto * Number(precio.iva_prod));
    this.preview = {
      precioUnitarioProd: this.redondear(Number(precio.precio_compra_prod)), subtotalProd: subtotal,
      dctoCompraProd: dctoCompra, dctoCaducProd: dctoCaduc, ivaProd: iva, totalProd: this.redondear(neto + iva),
    };
  }

  private construirPayload(): IPedidoCompleto {
    return {
      cabeceraPedido: {
        ...(this.isAdd ? {} : { idePedi: this.idPedido }),
        ideEmpr: Number(this.formData.controls.ideEmpr.value),
        motivoPedi: this.formData.controls.motivoPedi.value as EnumMotivosPedido,
        fechaEntrPedi: this.formData.controls.fechaEntrPedi.value!,
        observacionPedi: this.formData.controls.observacionPedi.value?.trim() || null,
      },
      detallePedido: this.detalles.map(({ ideProd, cantidadProd }) => ({ ideProd, cantidadProd })),
    };
  }

  private limpiarSeleccionProducto(): void {
    this.productoSeleccionado = -1;
    this.cantidadProducto = 1;
    this.preview = { ...VACIO };
  }

  private crearClaveLocal(): string {
    this.secuenciaLocal += 1;
    return `nueva-${this.secuenciaLocal}`;
  }

  private redondear(valor: number): number { return Math.round((valor + Number.EPSILON) * 100) / 100; }
  private formatearFecha(fecha: Date): string { return new Intl.DateTimeFormat('es-EC', { dateStyle: 'short', timeStyle: 'short' }).format(fecha); }
  private fechaCalendarioLocal(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  private extraerFechaCalendario(value: string): string {
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
    const local = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(value);
    return local ? `${local[3]}-${local[2]}-${local[1]}` : this.fechaCalendarioLocal(new Date());
  }
  private alerta(title: string, text: string, icon: 'warning' | 'error' = 'warning'): void { void Swal.fire({ icon, title, text }); }
  private mensajeRespuesta(response: string | undefined, fallback: string): string {
    if (!response) return fallback;
    try { return JSON.parse(response).message ?? fallback; } catch { return response; }
  }
}
