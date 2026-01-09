import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IPerfil, IPerfilResult } from '@models';
import { PerfilesService, RolesService } from '@services/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import Swal from 'sweetalert2';

type PerfilFormGroup = FormGroupOf<IPerfil>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    UiComboBoxComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _rolesService = inject(RolesService);
  public location = inject(Location);

  protected formData!: PerfilFormGroup;
  private initialFormValue!: IPerfil;

  protected isAdd = true;
  private idParam = -1;

  protected opcionesRoles: IComboBoxOption[] = [];

  ngOnInit(): void {
    this.loadComboRoles();
    this.initForm();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private loadComboRoles() {
    this._rolesService.listarComboRoles().subscribe(
      (res) => {
        this.opcionesRoles = res;
      }
    );
  }

  private initForm() {
    this.formData = this._fb.group({
      idePerf: [{ value: -1, disabled: true }, Validators.required],
      ideRol: [0, Validators.required],
      nombrePerf: ['', Validators.required],
      descripcionPerf: ['', Validators.required]
    }) as PerfilFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._perfilesService.buscar(id).subscribe(res => {
      const c = res.data[0] as IPerfilResult;
      this.formData.patchValue({
        idePerf: c.ide_perf,
        ideRol: c.ide_rol,
        nombrePerf: c.nombre_perf,
        descripcionPerf: c.descripcion_perf
      });
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as IPerfil;

      if (this.isAdd) {
        data.idePerf = -1;
        this._perfilesService.insertar(data).subscribe(() => {
          Swal.fire('Perfil registrado', '', 'success');
          this.location.back();
          this.resetForm();
        });
      } else {
        Swal.fire({
          title: '¿Actualizar Perfil?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí'
        }).then(r => {
          if (r.isConfirmed) {
            data.idePerf = this.idParam;
            this._perfilesService.actualizar(this.idParam, data).subscribe(() => {
              Swal.fire('Perfil actualizado', '', 'success');
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
