import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ICuenta, ICuentaResult, ListEstadosCuenta } from '@models';
import { CuentasService, EmpleadosService, PerfilesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';
import { IComboBoxOption } from '@shared/models/combo_box_option';

type CuentaFormGroup = FormGroupOf<ICuenta>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _cuentasService = inject(CuentasService);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _perfilesService = inject(PerfilesService);
  public location = inject(Location);

  protected formData!: CuentaFormGroup;
  private initialFormValue!: ICuenta;

  protected empleados!: IComboBoxOption[];
  protected perfiles!: IComboBoxOption[];
  protected estadosCuenta = ListEstadosCuenta;
  protected isAdd = true;
  private idParam = -1;

  ngOnInit(): void {
    this.initForm();
    this.loadEmpleados();
    this.loadPerfiles();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private initForm() {
    this.formData = this._fb.group({
      ideCuen: [{ value: -1, disabled: true }, Validators.required],
      ideEmpl: [-1, Validators.required],
      idePerf: [-1, Validators.required],
      usuarioCuen: ['', Validators.required],
      passwordCuen: ['', Validators.required],
      estadoCuen: ['activo', Validators.required]
    }) as CuentaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEmpleados() {
    this._empleadosService.listarComboEmpleados().subscribe(res => {
      this.empleados = res;
    });
  }

  private loadPerfiles() {
    this._perfilesService.listarComboPerfiles().subscribe(res => {
      this.perfiles = res;
    });
  }

  private setData(id: number) {
    this._cuentasService.buscar(id).subscribe(res => {
      const c = res.data[0] as ICuentaResult;
      this.formData.patchValue({
        ideCuen: c.ide_cuen,
        ideEmpl: c.ide_empl,
        idePerf: c.ide_perf,
        usuarioCuen: c.usuario_cuen,
        passwordCuen: '', // No mostrar password por seguridad
        estadoCuen: c.estado_cuen
      });
      
      // Al editar, la contraseña no es obligatoria
      this.formData.controls.passwordCuen.clearValidators();
      this.formData.controls.passwordCuen.updateValueAndValidity();
    });
  }

  protected guardar(): void {
    if(!this.formData.invalid){
      const data = this.formData.getRawValue() as ICuenta;
      
      if(this.isAdd){
        data.ideCuen = -1;
        this._cuentasService.insertar(data).subscribe(
          (res) => {
            Swal.fire({
              title: "Cuenta registrada :)",
              text: "La cuenta fue guardada correctamente",
              icon: "success"
            });
            this.location.back();
            this.resetForm();
          }
        );
      }else{
        Swal.fire({
          title: "¿Está seguro de modificar esta cuenta?",
          text: "Los cambios realizados se registrarán!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, de acuerdo"
        }).then((result) => {
          if (result.isConfirmed) {
            data.ideCuen = this.idParam;
            // Si no se ingresó nueva contraseña, mantener la anterior enviando vacío
            if (!data.passwordCuen) {
              data.passwordCuen = '';
            }
            this._cuentasService.actualizar(this.idParam, data).subscribe(
              (res) => {
                Swal.fire({
                  title: "Cuenta actualizada :)",
                  text: "La cuenta fue actualizada correctamente",
                  icon: "success"
                });
                this.location.back();
                this.resetForm();
              }
            );
          }
        });
        
      }
    }else{
      Swal.fire({
        icon: "info",
        title: "Oops... Faltan datos",
        text: "Revise por favor la información ingresada"
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
