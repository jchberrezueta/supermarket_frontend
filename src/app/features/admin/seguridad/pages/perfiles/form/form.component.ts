import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { FormGroupOf } from '@core/utils/utilities';
import { IPerfil, IPerfilResult } from '@models';
import { PerfilesService, RolesService } from '@services/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type PerfilFormGroup = FormGroupOf<IPerfil>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiComboBoxComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent implements OnInit {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _perfilesService = inject(PerfilesService);
  private readonly _rolesService = inject(RolesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected formData!: PerfilFormGroup;
  private initialFormValue!: IPerfil;

  // Combos
  protected roles: IComboBoxOption[] = [];

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
    this._rolesService.listarComboRoles().subscribe({
      next: (res) => {
        this.roles = res;
      }
    });
  }

  private initForm() {
    this.formData = this._fb.group({
      idePerf: [{ value: -1, disabled: true }, Validators.required],
      ideRol: [-1, Validators.required],
      nombrePerf: ['', Validators.required],
      descripcionPerf: ['', Validators.required]
    }) as PerfilFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._loadingService.show();
    this._perfilesService.buscar(id).subscribe({
      next: (res) => {
        const p = res.data[0] as IPerfilResult;
        this.formData.patchValue({
          idePerf: p.ide_perf,
          ideRol: p.ide_rol,
          nombrePerf: p.nombre_perf,
          descripcionPerf: p.descripcion_perf
        });
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as IPerfil;

      if (this.isAdd) {
        data.idePerf = -1;
        this._loadingService.show();
        this._perfilesService.insertar(data).subscribe({
          next: () => {
            this._loadingService.hide();
            Swal.fire('Perfil registrado', '', 'success');
            this.location.back();
            this.resetForm();
          },
          error: () => this._loadingService.hide()
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
            this._loadingService.show();
            this._perfilesService.actualizar(this.idParam, data).subscribe({
              next: () => {
                this._loadingService.hide();
                Swal.fire('Perfil actualizado', '', 'success');
                this.location.back();
                this.resetForm();
              },
              error: () => this._loadingService.hide()
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
