import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ICategoria, ICategoriaResult } from '@models';
import { CategoriasService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';

type CategoriaFormGroup = FormGroupOf<ICategoria>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
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
  private readonly _categoriasService = inject(CategoriasService);
  public location = inject(Location);

  protected formData!: CategoriaFormGroup;
  private initialFormValue!: ICategoria;

  protected isAdd = true;
  private idParam = -1;

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
      ideCate: [{ value: -1, disabled: true }, Validators.required],
      nombreCate: ['', Validators.required],
      descripcionCate: ['', Validators.required]
    }) as CategoriaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._categoriasService.buscar(id).subscribe(res => {
      const c = res.data[0] as ICategoriaResult;
      this.formData.patchValue({
        ideCate: c.ide_cate,
        nombreCate: c.nombre_cate,
        descripcionCate: c.descripcion_cate
      });
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as ICategoria;

      if (this.isAdd) {
        data.ideCate = -1;
        this._categoriasService.insertar(data).subscribe(() => {
          Swal.fire('Categoría registrada', '', 'success');
          this.location.back();
          this.resetForm();
        });
      } else {
        Swal.fire({
          title: '¿Actualizar categoría?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí'
        }).then(r => {
          if (r.isConfirmed) {
            data.ideCate = this.idParam;
            this._categoriasService.actualizar(this.idParam, data).subscribe(() => {
              Swal.fire('Categoría actualizada', '', 'success');
              this.location.back();
              this.resetForm();
            });
          }
        });
      }
    }
  }

  protected cancelar() {
    Swal.fire({
      title: "Esta Seguro de Cancelar?",
      text: "Los cambios realizados no se guardaran!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Cancelar!"
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
