import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { FormGroupOf } from '@core/utils/utilities';
import { IVenta, IVentaResult, EnumEstadoVenta, IDetalleVenta } from '@models';
import { VentasService, IVentaConDetalle } from '@services/ventas.service';
import { ClientesService } from '@services/clientes.service';
import { ProductosService } from '@services/productos.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

// Interfaz para el detalle en la tabla
interface IDetalleTabla {
  ideProd: number;
  nombreProd: string;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  dctoPromoProd: number;
  ivaProd: number;
  totalProd: number;
}

interface IVentaForm {
  ideVent: number;
  ideClie: number;
  ideEmpl: number;
  numFacturaVent: string;
  fechaVent: string;
  cantidadVent: number;
  subTotalVent: number;
  totalVent: number;
  dctoSocioVent: number;
  dctoEdadVent: number;
  estadoVent: string;
}

type VentaFormGroup = FormGroupOf<IVentaForm>;

const IMPORTS = [
  CommonModule,
  FormsModule,
  UiTextFieldComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  UiDatetimePickerComponent,
  ReactiveFormsModule
];

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _ventasService = inject(VentasService);
  private readonly _clientesService = inject(ClientesService);
  private readonly _productosService = inject(ProductosService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected formData!: VentaFormGroup;
  private initialFormValue!: IVentaForm;

  // Combos
  protected clientes: IComboBoxOption[] = [];
  protected productos: IComboBoxOption[] = [];
  protected opcionesEstado: IComboBoxOption[] = [
    { label: 'Completado', value: 'completado' },
    { label: 'Cancelado', value: 'cancelado' },
    { label: 'Devuelto', value: 'devuelto' }
  ];

  // Detalle de la venta
  protected detalles: IDetalleTabla[] = [];
  protected productoSeleccionado: number = -1;
  protected cantidadProducto: number = 1;
  protected precioUnitario: number = 0;
  protected ivaProd: number = 0;
  protected dctoPromoProd: number = 0;

  protected isAdd = true;
  private idParam = -1;

  constructor() {
    this.loadCombos();
  }

  ngOnInit(): void {
    this.initForm();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private loadCombos() {
    forkJoin({
      clientes: this._clientesService.listarComboClientes(),
      productos: this._productosService.listarComboProductos()
    }).subscribe({
      next: (res) => {
        this.clientes = res.clientes;
        this.productos = res.productos;
      }
    });
  }

  private initForm() {
    this.formData = this._fb.group({
      ideVent: [{ value: -1, disabled: true }, Validators.required],
      ideClie: [-1, Validators.required],
      ideEmpl: [0],
      numFacturaVent: ['', Validators.required],
      fechaVent: ['', Validators.required],
      cantidadVent: [0, [Validators.required, Validators.min(0)]],
      subTotalVent: [0, [Validators.required, Validators.min(0)]],
      totalVent: [0, [Validators.required, Validators.min(0)]],
      dctoSocioVent: [0, Validators.min(0)],
      dctoEdadVent: [0, Validators.min(0)],
      estadoVent: ['completado', Validators.required]
    }) as VentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._loadingService.show();
    
    forkJoin({
      venta: this._ventasService.buscar(id),
      detalles: this._ventasService.buscarDetallesVenta(id)
    }).subscribe({
      next: (res) => {
        const v = res.venta.data[0] as IVentaResult;
        this.formData.patchValue({
          ideVent: v.ide_vent,
          ideClie: v.ide_clie,
          ideEmpl: v.ide_empl,
          numFacturaVent: v.num_factura_vent,
          fechaVent: v.fecha_vent,
          cantidadVent: v.cantidad_vent,
          subTotalVent: v.sub_total_vent,
          totalVent: v.total_vent,
          dctoSocioVent: v.dcto_socio_vent,
          dctoEdadVent: v.dcto_edad_vent,
          estadoVent: v.estado_vent
        });

        // Cargar detalles de la venta
        if (res.detalles.data && res.detalles.data.length > 0) {
          this.detalles = res.detalles.data.map((d: any) => {
            const nombreProd = this.productos.find(p => +p.value === d.ide_prod)?.label || `Producto ID: ${d.ide_prod}`;
            return {
              ideProd: d.ide_prod,
              nombreProd: nombreProd,
              cantidadProd: d.cantidad_prod,
              precioUnitarioProd: d.precio_unitario_prod,
              subtotalProd: d.subtotal_prod,
              ivaProd: d.iva_prod,
              dctoPromoProd: d.dcto_promo_prod,
              totalProd: d.total_prod
            };
          });
        }

        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  // Métodos para manejar el detalle
  protected agregarProducto(): void {
    if (this.productoSeleccionado <= 0 || this.cantidadProducto <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Seleccione un producto y cantidad válida'
      });
      return;
    }

    // Verificar si el producto ya existe
    const existente = this.detalles.find(d => d.ideProd === this.productoSeleccionado);
    if (existente) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto duplicado',
        text: 'Este producto ya está en la lista'
      });
      return;
    }

    const subtotal = this.cantidadProducto * this.precioUnitario;
    const total = subtotal + this.ivaProd - this.dctoPromoProd;
    
    const nombreProd = this.productos.find(p => +p.value === this.productoSeleccionado)?.label || '';
    
    this.detalles.push({
      ideProd: Math.floor(this.productoSeleccionado),
      nombreProd: nombreProd,
      cantidadProd: Math.floor(this.cantidadProducto),
      precioUnitarioProd: +this.precioUnitario,
      subtotalProd: +subtotal,
      ivaProd: +this.ivaProd,
      dctoPromoProd: +this.dctoPromoProd,
      totalProd: +total
    });

    this.actualizarTotales();
    this.limpiarFormProducto();
  }

  protected eliminarProducto(index: number): void {
    this.detalles.splice(index, 1);
    this.actualizarTotales();
  }

  private actualizarTotales(): void {
    const cantidadTotal = this.detalles.reduce((sum, d) => sum + d.cantidadProd, 0);
    const subTotal = this.detalles.reduce((sum, d) => sum + d.subtotalProd, 0);
    const total = this.detalles.reduce((sum, d) => sum + d.totalProd, 0);
    
    this.formData.patchValue({
      cantidadVent: cantidadTotal,
      subTotalVent: subTotal,
      totalVent: total
    });
  }

  private limpiarFormProducto(): void {
    this.productoSeleccionado = -1;
    this.cantidadProducto = 1;
    this.precioUnitario = 0;
    this.ivaProd = 0;
    this.dctoPromoProd = 0;
  }

  protected guardar() {
    if (!this.formData.valid) {
      Swal.fire('Oops', 'Faltan datos obligatorios', 'info');
      return;
    }

    if (this.detalles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin productos',
        text: 'Debe agregar al menos un producto a la venta'
      });
      return;
    }

    const formValue = this.formData.getRawValue();
    
    // Convertir detalles al formato esperado por el backend
    const detalleVenta: IDetalleVenta[] = this.detalles.map(d => ({
      ideDetaVent: -1,
      ideVent: -1,
      ideProd: Math.floor(d.ideProd),
      cantidadProd: Math.floor(d.cantidadProd),
      precioUnitarioProd: +d.precioUnitarioProd,
      subtotalProd: +d.subtotalProd,
      dctoPromoProd: +d.dctoPromoProd,
      ivaProd: +d.ivaProd,
      totalProd: +d.totalProd
    }));

    const ventaCompleta: IVentaConDetalle = {
      cabeceraVenta: {
        ideVent: this.isAdd ? -1 : this.idParam,
        ideEmpl: Math.floor(+formValue.ideEmpl) || 0,
        ideClie: Math.floor(+formValue.ideClie),
        numFacturaVent: formValue.numFacturaVent,
        fechaVent: formValue.fechaVent,
        cantidadVent: Math.floor(+formValue.cantidadVent) || 1,
        subTotalVent: +formValue.subTotalVent,
        totalVent: +formValue.totalVent,
        dctoSocioVent: +formValue.dctoSocioVent,
        dctoEdadVent: +formValue.dctoEdadVent,
        estadoVent: formValue.estadoVent as EnumEstadoVenta
      },
      detalleVenta: detalleVenta
    };

    if (this.isAdd) {
      this._loadingService.show();
      this._ventasService.insertar(ventaCompleta).subscribe({
        next: () => {
          this._loadingService.hide();
          Swal.fire('Venta registrada', 'La venta fue guardada correctamente', 'success');
          this.location.back();
          this.resetForm();
        },
        error: () => this._loadingService.hide()
      });
    } else {
      Swal.fire({
        title: '¿Actualizar venta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar'
      }).then(r => {
        if (r.isConfirmed) {
          this._loadingService.show();
          this._ventasService.actualizar(this.idParam, ventaCompleta).subscribe({
            next: () => {
              this._loadingService.hide();
              Swal.fire('Venta actualizada', 'Cambios guardados', 'success');
              this.location.back();
              this.resetForm();
            },
            error: () => this._loadingService.hide()
          });
        }
      });
    }
  }

  protected cancelar() {
    Swal.fire({
      title: '¿Cancelar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí'
    }).then(r => {
      if (r.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
    this.detalles = [];
    this.limpiarFormProducto();
  }
}
