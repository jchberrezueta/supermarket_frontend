import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { FormGroupOf } from '@core/utils/utilities';
import { IPedido, IPedidoResult, IDetallePedido, EnumEstadoDetallePedido } from '@models';
import { PedidosService, EmpresasService, ProductosService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';
import Swal from 'sweetalert2';

// Interfaz para el detalle en la tabla
interface IDetalleTabla {
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

const IMPORTS = [
  CommonModule,
  FormsModule,
  UiTextFieldComponent, 
  UiTextAreaComponent,
  UiDatetimePickerComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  ReactiveFormsModule, 
];

type PedidoFormGroup = FormGroupOf<IPedido>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent implements OnInit {
  
  protected empresas!: IComboBoxOption[];
  protected estados!: IComboBoxOption[];
  protected motivos!: IComboBoxOption[];
  protected productos!: IComboBoxOption[];
  
  // Detalle del pedido
  protected detalles: IDetalleTabla[] = [];
  protected productoSeleccionado: number = -1;
  protected cantidadProducto: number = 1;
  protected precioUnitario: number = 0;
  protected ivaProd: number = 0;
  protected dctoCompraProd: number = 0;
  protected dctoCaducProd: number = 0;
  
  private readonly _route = inject(ActivatedRoute);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _productosService = inject(ProductosService);
  private readonly _loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);
  public location = inject(Location);
  
  protected formData!: PedidoFormGroup;
  private initialFormValue!: IPedido;
  protected isAdd: boolean = true;
  private idParam: number = -1;
  private productosLoaded: boolean = false;

  constructor() {
    this.loadCombos();
  }

  ngOnInit() {
    const idParam = this._route.snapshot.params['id'];
    this.initForm();
    if(idParam){
      this.setData(idParam);
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      idePedi: [{ value: -1, disabled: true }, [Validators.required]],        
      ideEmpr: [-1, [Validators.required]],
      fechaPedi: ['', [Validators.required]],
      fechaEntrPedi: ['', [Validators.required]],
      cantidadTotalPedi: [0, [Validators.required, Validators.min(0)]],
      totalPedi: [0, [Validators.required, Validators.min(0)]],
      estadoPedi: ['', [Validators.required]],
      motivoPedi: ['', [Validators.required]],
      observacionPedi: ['']
    }) as PedidoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(idParam: number) {
    this._loadingService.show();
    this._pedidosService.buscar(idParam).subscribe({
      next: (res) => {
        const pedido = res.data[0] as IPedidoResult;
        this.idParam = pedido.ide_pedi;
        this.isAdd = false;
        this.formData.patchValue({
          idePedi: pedido.ide_pedi,
          ideEmpr: pedido.ide_empr,
          fechaPedi: pedido.fecha_pedi,
          fechaEntrPedi: pedido.fecha_entr_pedi,
          cantidadTotalPedi: pedido.cantidad_total_pedi,
          totalPedi: pedido.total_pedi,
          estadoPedi: pedido.estado_pedi,
          motivoPedi: pedido.motivo_pedi,
          observacionPedi: pedido.observacion_pedi
        });
        // Cargar detalles del pedido
        this.loadDetallesPedido(pedido.ide_pedi);
      },
      error: () => this._loadingService.hide()
    });
  }

  private loadDetallesPedido(idPedido: number): void {
    this._pedidosService.listarDetallesPedido(idPedido).subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          this.detalles = res.data.map((d: any) => {
            const nombreProd = this.productos?.find(p => +p.value === d.ide_prod)?.label || '';
            return {
              ideProd: d.ide_prod,
              nombreProd: nombreProd,
              cantidadProd: d.cantidad_prod,
              precioUnitarioProd: d.precio_unitario_prod,
              subtotalProd: d.subtotal_prod,
              ivaProd: d.iva_prod || 0,
              dctoCompraProd: d.dcto_compra_prod || 0,
              dctoCaducProd: d.dcto_caduc_prod || 0,
              totalProd: d.total_prod || d.subtotal_prod
            };
          });
        }
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  private loadCombos() {
    forkJoin({
      empresas: this._empresasService.listarComboEmpresas(),
      estados: this._pedidosService.listarComboEstados(),
      motivos: this._pedidosService.listarComboMotivos(),
      productos: this._productosService.listarComboProductos()
    }).subscribe({
      next: (res) => {
        this.empresas = res.empresas;
        this.estados = res.estados;
        this.motivos = res.motivos;
        this.productos = res.productos;
        this.productosLoaded = true;
      }
    });
  }

  // Métodos para manejar el detalle
  protected agregarProducto(): void {
    if (this.productoSeleccionado <= 0 || this.cantidadProducto <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Seleccione un producto y cantidad válida"
      });
      return;
    }

    // Verificar si el producto ya existe
    const existente = this.detalles.find(d => d.ideProd === this.productoSeleccionado);
    if (existente) {
      Swal.fire({
        icon: "warning",
        title: "Producto duplicado",
        text: "Este producto ya está en la lista"
      });
      return;
    }

    const subtotal = this.cantidadProducto * this.precioUnitario;
    const total = subtotal + this.ivaProd - this.dctoCompraProd - this.dctoCaducProd;
    
    const nombreProd = this.productos.find(p => +p.value === this.productoSeleccionado)?.label || '';
    
    this.detalles.push({
      ideProd: this.productoSeleccionado,
      nombreProd: nombreProd,
      cantidadProd: this.cantidadProducto,
      precioUnitarioProd: this.precioUnitario,
      subtotalProd: subtotal,
      ivaProd: this.ivaProd,
      dctoCompraProd: this.dctoCompraProd,
      dctoCaducProd: this.dctoCaducProd,
      totalProd: total
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
    const total = this.detalles.reduce((sum, d) => sum + d.totalProd, 0);
    
    this.formData.patchValue({
      cantidadTotalPedi: cantidadTotal,
      totalPedi: total
    });
  }

  private limpiarFormProducto(): void {
    this.productoSeleccionado = -1;
    this.cantidadProducto = 1;
    this.precioUnitario = 0;
    this.ivaProd = 0;
    this.dctoCompraProd = 0;
    this.dctoCaducProd = 0;
  }

  protected guardar(): void {
    if(this.formData.invalid){
      Swal.fire({
        icon: "info",
        title: "Oops... Faltan datos",
        text: "Revise por favor la información ingresada"
      });
      return;
    }

    if(this.detalles.length === 0){
      Swal.fire({
        icon: "warning",
        title: "Sin productos",
        text: "Debe agregar al menos un producto al pedido"
      });
      return;
    }

    const pedido = this.formData.getRawValue() as IPedido;
    
    // Convertir detalles al formato esperado por el backend
    const detallePedido = this.detalles.map(d => ({
      ideProd: d.ideProd,
      cantidadProd: d.cantidadProd,
      precioUnitarioProd: d.precioUnitarioProd,
      subtotalProd: d.subtotalProd,
      ivaProd: d.ivaProd,
      dctoCompraProd: d.dctoCompraProd,
      dctoCaducProd: d.dctoCaducProd,
      totalProd: d.totalProd,
      estadoDetaPedi: EnumEstadoDetallePedido.INCOMPLETO
    }));

    const pedidoCompleto: any = {
      cabeceraPedido: {
        ...pedido,
        ideEmpr: +pedido.ideEmpr,
        cantidadTotalPedi: +pedido.cantidadTotalPedi,
        totalPedi: +pedido.totalPedi
      },
      detallePedido: detallePedido
    };
    
    if(this.isAdd){
      pedidoCompleto.cabeceraPedido.idePedi = -1;
      this._loadingService.show();
      this._pedidosService.insertar(pedidoCompleto).subscribe({
        next: () => {
          this._loadingService.hide();
          Swal.fire({
            title: "Pedido registrado :)",
            text: "El pedido fue guardado correctamente",
            icon: "success"
          });
          this.location.back();
          this.resetForm();
        },
        error: () => this._loadingService.hide()
      });
    }else{
      Swal.fire({
        title: "¿Está seguro de modificar este pedido?",
        text: "Los cambios realizados se registrarán!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, de acuerdo"
      }).then((result) => {
        if (result.isConfirmed) {
          pedidoCompleto.cabeceraPedido.idePedi = this.idParam;
          this._loadingService.show();
          this._pedidosService.actualizar(this.idParam, pedidoCompleto).subscribe({
            next: () => {
              this._loadingService.hide();
              Swal.fire({
                title: "Pedido actualizado :)",
                text: "El pedido fue actualizado correctamente",
                icon: "success"
              });
              this.location.back();
              this.resetForm();
            },
            error: () => this._loadingService.hide()
          });
        }
      });
    }
  }

  protected cancelar(): void {
    Swal.fire({
      title: "¿Está Seguro de Cancelar?",
      text: "Los cambios realizados no se guardarán!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Cancelar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}
