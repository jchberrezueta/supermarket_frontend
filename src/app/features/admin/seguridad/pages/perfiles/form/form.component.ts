import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ICategoria, ICategoriaResult, IRol, IRolResult } from '@models';
import { CategoriasService, RolesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';

type RolFormGroup = FormGroupOf<IRol>;

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
  private readonly _rolesService = inject(RolesService);
  public location = inject(Location);

  protected formData!: RolFormGroup;
  private initialFormValue!: IRol;

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
      ideRol: [{ value: -1, disabled: true }, Validators.required],
      nombreRol: ['', Validators.required],
      descripcionRol: ['', Validators.required]
    }) as RolFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._rolesService.buscar(id).subscribe(res => {
      const c = res.data[0] as IRolResult;
      this.formData.patchValue({
        ideRol: c.ide_rol,
        nombreRol: c.nombre_rol,
        descripcionRol: c.descripcion_rol
      });
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as IRol;

      if (this.isAdd) {
        data.ideRol = -1;
        this._rolesService.insertar(data).subscribe(() => {
          Swal.fire('Rol registrado', '', 'success');
          this.location.back();
          this.resetForm();
        });
      } else {
        Swal.fire({
          title: '¿Actualizar Rol?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí'
        }).then(r => {
          if (r.isConfirmed) {
            data.ideRol = this.idParam;
            this._rolesService.actualizar(this.idParam, data).subscribe(() => {
              Swal.fire('Rol actualizado', '', 'success');
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
