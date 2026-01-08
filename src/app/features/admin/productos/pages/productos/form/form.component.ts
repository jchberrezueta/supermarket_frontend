import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { FormGroupOf } from '@core/utils/utilities';
import { IProducto, IProductoResult } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { ProductosService, CategoriasService, MarcasService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';

type ProductoFormGroup = FormGroupOf<IProducto>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _productosService = inject(ProductosService);
  private readonly _categoriasService = inject(CategoriasService);
  private readonly _marcasService = inject(MarcasService);
  public location = inject(Location);

  protected formData!: ProductoFormGroup;
  private initialFormValue!: IProducto;

  protected categorias!: IComboBoxOption[];
  protected marcas!: IComboBoxOption[];

  protected isAdd = true;
  private idParam = -1;

  constructor() {
    this.loadCategorias();
    this.loadMarcas();
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

  private initForm() {
    this.formData = this._fb.group({
      ideProd: [{ value: -1, disabled: true }, Validators.required],
      ideCate: [-1, Validators.required],
      ideMarc: [-1, Validators.required],
      codigoBarraProd: ['', Validators.required],
      nombreProd: ['', Validators.required],
      precioVentaProd: [0, Validators.required],
      ivaProd: [0, Validators.required],
      dctoPromoProd: [0, Validators.required],
      stockProd: [0, Validators.required],
      disponibleProd: ['si', Validators.required],
      estadoProd: ['activo', Validators.required],
      descripcionProd: [''],
      urlImgProd: ['', Validators.required],
    }) as ProductoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCategorias() {
    this._categoriasService.listarComboCategorias().subscribe(res => {
      this.categorias = res;
    });
  }

  private loadMarcas() {
    this._marcasService.listarComboMarcas().subscribe(res => {
      this.marcas = res;
    });
  }

  private setData(id: number) {
    this._productosService.buscar(id).subscribe(res => {
      const p = res.data[0] as IProductoResult;

      this.formData.patchValue({
        ideProd: p.ide_prod,
        ideCate: p.ide_cate,
        ideMarc: p.ide_marc,
        codigoBarraProd: p.codigo_barra_prod,
        nombreProd: p.nombre_prod,
        precioVentaProd: p.precio_venta_prod,
        ivaProd: p.iva_prod,
        dctoPromoProd: p.dcto_promo_prod,
        stockProd: p.stock_prod,
        disponibleProd: p.disponible_prod,
        estadoProd: p.estado_prod,
        descripcionProd: p.descripcion_prod,
        urlImgProd: p.url_img_prod
      });
    });
  }

  protected guardar() {
    if (!this.formData.valid) {
      Swal.fire('Oops...', 'Faltan datos por completar', 'info');
      return;
    }

    const data = this.formData.getRawValue() as IProducto;

    if (this.isAdd) {
      data.ideProd = -1;
      this._productosService.insertar(data).subscribe(() => {
        Swal.fire('Producto registrado', 'Registro exitoso', 'success');
        this.location.back();
        this.resetForm();
      });
    } else {
      Swal.fire({
        title: '¿Actualizar producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar'
      }).then(result => {
        if (result.isConfirmed) {
          data.ideProd = this.idParam;
          this._productosService.actualizar(this.idParam, data).subscribe(() => {
            Swal.fire('Producto actualizado', 'Cambios guardados', 'success');
            this.location.back();
            this.resetForm();
          });
        }
      });
    }
  }

  protected cancelar() {
    Swal.fire({
      title: '¿Cancelar?',
      text: 'Los cambios no se guardarán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar'
    }).then(result => {
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
