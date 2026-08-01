import { CommonModule, Location } from '@angular/common';

import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { IResultDataCreate } from '@core/models';

import { FormGroupOf } from '@core/utils/utilities';

import {
  EnumEstadosProducto,
  ICreateProducto,
  IProductoResult,
  IUpdateProducto,
} from '@models';

import {
  CategoriasService,
  MarcasService,
  ProductosService,
} from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';

import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import Swal from 'sweetalert2';

type ProductoFormGroup = FormGroupOf<IUpdateProducto>;

@Component({
  selector: 'app-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    UiInputBoxComponent,
  ],

  templateUrl: './form.component.html',

  styleUrl: './form.component.scss',
})
export default class FormComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly productosService = inject(ProductosService);

  private readonly categoriasService = inject(CategoriasService);

  private readonly marcasService = inject(MarcasService);

  public readonly location = inject(Location);

  protected formData!: ProductoFormGroup;

  private initialFormValue!: IUpdateProducto;
  protected categorias: IComboBoxOption[] = [];

  protected marcas: IComboBoxOption[] = [];

  protected opcionesProdEstados: IComboBoxOption[] = [];

  protected isAdd = true;

  protected idParam = -1;

  ngOnInit(): void {
    this.initForm();
    this.loadCombos();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      void Swal.fire({
        icon: 'error',
        title: 'Identificador inválido',
        text: 'El identificador del producto no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;

    this.setData(id);
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideProd: [-1, Validators.required],

      ideCate: [-1, [Validators.required, Validators.min(1)]],

      ideMarc: [-1, [Validators.required, Validators.min(1)]],

      codigoBarraProd: ['', [Validators.required, Validators.maxLength(30)]],

      nombreProd: ['', [Validators.required, Validators.maxLength(100)]],

      precioVentaProd: [0, [Validators.required, Validators.min(0)]],

      ivaProd: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],

      dctoPromoProd: [0, [Validators.required, Validators.min(0)]],

      stockMinimoProd: [0, [Validators.required, Validators.min(0)]],

      estadoProd: [EnumEstadosProducto.ACTIVO, Validators.required],

      descripcionProd: [null, Validators.maxLength(250)],

      urlImgProd: [null, Validators.maxLength(500)],
    }) as ProductoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCombos(): void {
    this.categoriasService.listarComboCategorias().subscribe({
      next: (response) => {
        this.categorias = response ?? [];
      },

      error: () => {
        this.categorias = [];
      },
    });

    this.marcasService.listarComboMarcas().subscribe({
      next: (response) => {
        this.marcas = response ?? [];
      },

      error: () => {
        this.marcas = [];
      },
    });

    this.productosService.listarComboEstados().subscribe({
      next: (response) => {
        this.opcionesProdEstados = response ?? [];
      },

      error: () => {
        this.opcionesProdEstados = [];
      },
    });
  }

  private setData(id: number): void {
    this.productosService.buscar(id).subscribe({
      next: (response) => {
        const producto = response.data[0] as IProductoResult | undefined;

        if (!producto) {
          void Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'No se encontró el producto solicitado.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.formData.patchValue({
          ideProd: producto.ide_prod,

          ideCate: producto.ide_cate,

          ideMarc: producto.ide_marc,

          codigoBarraProd: producto.codigo_barra_prod,

          nombreProd: producto.nombre_prod,

          precioVentaProd: Number(producto.precio_venta_prod),

          /*
           * La base antigua puede contener:
           * 0.15 o 15 para representar 15 %.
           *
           * En el formulario siempre mostraremos 15.
           */
          ivaProd: Number(producto.iva_prod ?? 0),

          dctoPromoProd: Number(producto.dcto_promo_prod),

          stockMinimoProd: Number(producto.stock_minimo_prod ?? 0),

          estadoProd: producto.estado_prod,

          descripcionProd: producto.descripcion_prod ?? null,

          urlImgProd: producto.url_img_prod ?? null,
        });
      },

      error: (error) => {
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el producto',
          text: this.obtenerErrorHttp(error),
        }).then(() => {
          this.location.back();
        });
      },
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Revise los campos obligatorios y los valores numéricos.',
      });

      return;
    }

    const raw = this.formData.getRawValue();

    const precioVenta = Number(raw.precioVentaProd);

    const descuentoUnitario = Number(raw.dctoPromoProd);

    if (descuentoUnitario > precioVenta) {
      void Swal.fire({
        icon: 'warning',
        title: 'Descuento inválido',
        text: 'El descuento promocional por unidad no puede superar el precio de venta.',
      });

      return;
    }

    const commonData = {
      ideCate: Number(raw.ideCate),

      ideMarc: Number(raw.ideMarc),

      codigoBarraProd: raw.codigoBarraProd.trim().toLowerCase(),

      nombreProd: raw.nombreProd.trim().toLowerCase(),

      precioVentaProd: precioVenta,

      ivaProd: Number(raw.ivaProd),

      dctoPromoProd: descuentoUnitario,

      stockMinimoProd: Number(raw.stockMinimoProd),

      estadoProd: raw.estadoProd,

      descripcionProd: raw.descripcionProd?.trim().toLowerCase() || null,

      urlImgProd: raw.urlImgProd?.trim() || null,
    };

    if (this.isAdd) {
      const body: ICreateProducto = {
        ...commonData,
      };

      this.productosService.insertar(body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Producto registrado');
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

    void Swal.fire({
      title: '¿Actualizar producto?',

      text: 'El stock y la disponibilidad no serán modificados desde este formulario.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, actualizar',

      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const body: IUpdateProducto = {
        ideProd: this.idParam,

        ...commonData,
      };

      this.productosService.actualizar(this.idParam, body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Producto actualizado');
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

  protected cancelar(): void {
    void Swal.fire({
      title: '¿Cancelar cambios?',

      text: 'La información no guardada se perderá.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, cancelar',

      cancelButtonText: 'Continuar editando',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private procesarRespuesta(response: IResultDataCreate, titulo: string): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensaje(
      response.p_response,

      success
        ? 'Operación completada correctamente.'
        : 'No se pudo completar la operación.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? titulo : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success) {
        this.location.back();
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
