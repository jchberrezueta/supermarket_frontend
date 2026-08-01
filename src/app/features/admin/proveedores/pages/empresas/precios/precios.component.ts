import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTableListComponent } from '@shared/components/table-list/table-list.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { FormGroupOf } from '@core/utils/utilities';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { PreciosEmpresaConfig } from './precios.config';
import { IEmpresa, IEmpresaPrecios } from '@models';
import { ProductosService } from '@services/productos.service';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { EmpresasService } from '@services/empresas.service';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IResultDataCreate } from '@core/models';

type EmpresaPrecioFormGroup = FormGroupOf<IEmpresaPrecios>;

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTableListComponent,
    UiInputBoxComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    ReactiveFormsModule,
    UiComboBoxComponent,
  ],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss',
})
export default class PreciosComponent {
  private readonly _tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);
  private readonly _route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _productosService = inject(ProductosService);
  public location = inject(Location);
  protected readonly config = PreciosEmpresaConfig;
  protected productos: IComboBoxOption[] = [];
  protected estadosPreciosProds: IComboBoxOption[] = [];
  protected empresa!: IEmpresa;
  protected nombreEmpresa: string = '';

  protected isAdd: boolean = true;
  protected idEmpresa: number = 1;

  private precioEmp!: any;
  protected formData!: EmpresaPrecioFormGroup;
  private initialFormValue!: IEmpresaPrecios;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idEmpresa = +idParam;
      this.initForm();
      this.loadEmpresa();
      this.loadProductos();
      this.loadEstadosPrecProds();
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideEmprProd: [
        {
          value: -1,
          disabled: true,
        },
        Validators.required,
      ],

      ideEmpr: [this.idEmpresa, [Validators.required, Validators.min(1)]],

      ideProd: [-1, [Validators.required, Validators.min(1)]],

      precioCompraProd: [0, [Validators.required, Validators.min(0.01)]],

      dctoCompraProd: [0, [Validators.required, Validators.min(0)]],

      dctoCaducidadProd: [0, [Validators.required, Validators.min(0)]],

      ivaProd: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],

      estadoEmprProd: ['activo', Validators.required],
    }) as EmpresaPrecioFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(): void {
    this.formData.patchValue({
      ideEmprProd: this.precioEmp?.ide_empr_prod,
      ideEmpr: this.precioEmp?.ide_empr,
      ideProd: this.precioEmp?.ide_prod,
      precioCompraProd: Number(this.precioEmp?.precio_compra_prod ?? 0),
      dctoCompraProd: Number(this.precioEmp?.dcto_compra_prod ?? 0),
      dctoCaducidadProd: Number(this.precioEmp?.dcto_caducidad_prod ?? 0),
      ivaProd: Number(this.precioEmp?.iva_prod ?? 0),
      estadoEmprProd: this.precioEmp?.estado_empr_prod,
    });
  }

  private loadProductos() {
    this._productosService
      .listarComboProductosActivosSinPrecioPorEmpresa(this.idEmpresa)
      .subscribe((res) => {
        this.productos = res;
      });
  }

  private loadEstadosPrecProds() {
    this._empresasService.listarPreciosEstados().subscribe((res) => {
      this.estadosPreciosProds = res;
    });
  }

  private loadEmpresa() {
    this._empresasService.buscarActiva(this.idEmpresa).subscribe((res) => {
      const data = res.data[0];
      if (data != null) {
        this.empresa = {
          ideEmp: data.ide_empr,
          nombreEmp: data.nombre_empr,
          responsableEmp: data.responsable_empr,
          fechaContratoEmp: data.fecha_contrato_empr,
          direccionEmp: data.direccion_empr,
          telefonoEmp: data.telefono_empr,
          emailEmp: data.email_empr,
          estadoEmp: data.estado_empr,
          descripcionEmp: data.descripcion_empr,
        };
        this.nombreEmpresa = this.empresa.nombreEmp;
      } else {
        Swal.fire({
          title: 'Empresa no Activa',
          text: 'No puede gestionar los precios de los productos de una empresa actualmente inactiva.',
          icon: 'info',
          confirmButtonColor: 'var(--sm-color-primary)',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          this.location.back();
        });
      }
    });
  }

  protected setIdEmprProd(elem: any) {
    if (elem && elem.row) {
      this.precioEmp = elem.row;
    } else {
      if (!this.isAdd) {
        this.resetForm();
        this.isAdd = true;
      }
      this.precioEmp = null;
    }
  }

  protected changeModeUpdate(): void {
    if (!this.precioEmp) {
      void Swal.fire({
        title: 'Producto no seleccionado',

        text: 'Seleccione un precio de la lista para modificarlo.',

        icon: 'info',

        confirmButtonText: 'Aceptar',
      });

      return;
    }

    const productoExiste = this.productos.some(
      (producto) => Number(producto.value) === Number(this.precioEmp.ide_prod),
    );

    if (!productoExiste) {
      this.productos = [
        {
          label: this.precioEmp.nombre_prod,

          value: this.precioEmp.ide_prod,
        },

        ...this.productos,
      ];
    }

    this.formData.get('ideProd')?.disable();

    this.isAdd = false;

    this.setData();
  }

  protected changeModeInsert(): void {
    this.isAdd = true;
    this.precioEmp = null;

    this.formData.get('ideProd')?.enable();

    this.resetForm();
    this.loadProductos();
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Revise la información ingresada.',
      });

      return;
    }

    const raw = this.formData.getRawValue();

    const precioCompra = Number(raw.precioCompraProd);

    const descuentoCompra = Number(raw.dctoCompraProd);

    const descuentoCaducidad = Number(raw.dctoCaducidadProd);

    if (descuentoCompra > precioCompra) {
      void Swal.fire({
        icon: 'warning',
        title: 'Descuento inválido',
        text: 'El descuento de compra unitario no puede superar el precio de compra.',
      });

      return;
    }

    if (descuentoCaducidad > precioCompra) {
      void Swal.fire({
        icon: 'warning',
        title: 'Descuento inválido',
        text: 'El descuento por caducidad unitario no puede superar el precio de compra.',
      });

      return;
    }

    if (descuentoCompra + descuentoCaducidad > precioCompra) {
      void Swal.fire({
        icon: 'warning',
        title: 'Descuentos inválidos',
        text: 'La suma de los descuentos unitarios no puede superar el precio de compra.',
      });

      return;
    }

    const data: IEmpresaPrecios = {
      ...raw,

      ideEmpr: Number(raw.ideEmpr),

      ideProd: Number(raw.ideProd),

      precioCompraProd: precioCompra,

      dctoCompraProd: descuentoCompra,

      dctoCaducidadProd: descuentoCaducidad,

      ivaProd: Number(raw.ivaProd),
    };

    if (this.isAdd) {
      const { ideEmprProd: _ideEmprProd, ...createData } = data;

      this._empresasService.insertarPrecio(createData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Precio registrado');
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: this.obtenerErrorHttp(error),
          });
        },
      });

      return;
    }

    if (!this.precioEmp) {
      void Swal.fire({
        icon: 'warning',
        title: 'Precio no seleccionado',
        text: 'Seleccione un registro para modificar.',
      });

      return;
    }

    void Swal.fire({
      title: '¿Actualizar precio?',

      text: 'Los cambios serán guardados.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, actualizar',

      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const body: IEmpresaPrecios = {
        ...data,

        ideEmprProd: this.precioEmp.ide_empr_prod,
      };

      this._empresasService
        .actualizarPrecio(
          this.precioEmp.ide_empr_prod,

          body,
        )
        .subscribe({
          next: (response) => {
            this.procesarRespuesta(response, 'Precio actualizado');
          },

          error: (error) => {
            void Swal.fire({
              icon: 'error',
              title: 'No se pudo actualizar',
              text: this.obtenerErrorHttp(error),
            });
          },
        });
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }

  protected volver() {
    Swal.fire({
      title: 'Esta Seguro de Volver?',
      text: 'Los cambios realizados no se guardaran!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Volver!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        this.isAdd = true;
        this.precioEmp = null;
        this.location.back();
      }
    });
  }

  protected refreshData() {
    this._tableList().refreshData();
    this.changeModeInsert();
    this.loadProductos();
  }

  private procesarRespuesta(
    response: IResultDataCreate,
    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensaje(
      response.p_response,

      success
        ? 'Operación completada correctamente.'
        : 'No se pudo completar la operación.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? successTitle : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success) {
        this.refreshData();
      }
    });
  }

  private obtenerMensaje(
    response: string | undefined,

    fallback: string,
  ): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as {
        message?: string;
      };

      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }

  private obtenerErrorHttp(error: unknown): string {
    const httpError = error as {
      error?: {
        message?: string | string[];
      };

      message?: string;
    };

    const message = httpError.error?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message ?? httpError.message ?? 'Ocurrió un error inesperado.';
  }
}
