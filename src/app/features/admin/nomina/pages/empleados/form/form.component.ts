import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IEmpleado, IEmpleadoResult, ListEstadosEmpleado } from '@models';
import { EmpleadosService, RolesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';
import { IComboBoxOption } from '@shared/models/combo_box_option';

type EmpleadoFormGroup = FormGroupOf<IEmpleado>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _empleadosService = inject(EmpleadosService);
  private readonly _rolesService = inject(RolesService);
  public location = inject(Location);

  protected formData!: EmpleadoFormGroup;
  private initialFormValue!: IEmpleado;

  protected roles!: IComboBoxOption[];
  protected estadosEmpleado = ListEstadosEmpleado;
  protected isAdd = true;
  private idParam = -1;

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private initForm() {
    this.formData = this._fb.group({
      ideEmpl: [{ value: -1, disabled: true }, Validators.required],
      ideRol: [-1, Validators.required],
      cedulaEmpl: ['', Validators.required],
      primerNombreEmpl: ['', Validators.required],
      segundoNombreEmpl: [''],
      apellidoPaternoEmpl: ['', Validators.required],
      apellidoMaternoEmpl: [''],
      fechaNacimientoEmpl: ['', Validators.required],
      edadEmpl: [0, Validators.required],
      fechaInicioEmpl: ['', Validators.required],
      fechaTerminoEmpl: [''],
      tituloEmpl: ['', Validators.required],
      rmuEmpl: [1, [Validators.required, Validators.min(1)]],
      estadoEmpl: ['activo', Validators.required],
    }) as EmpleadoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadRoles() {
    this._rolesService.listarComboRoles().subscribe(res => {
      this.roles = res;
    });
  }

  private setData(id: number) {
    this._empleadosService.buscar(id).subscribe(res => {
      const e = res.data[0] as IEmpleadoResult;
      
      // Formatear fechas correctamente para datetime-picker
      const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        // Si la fecha ya viene en formato YYYY-MM-DD, devolverla tal cual
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Si viene con timestamp, extraer solo la fecha
        return dateStr.split('T')[0];
      };

      this.formData.patchValue({
        ideEmpl: e.ide_empl,
        ideRol: e.ide_rol,
        cedulaEmpl: e.cedula_empl,
        primerNombreEmpl: e.primer_nombre_empl,
        segundoNombreEmpl: e.segundo_nombre_empl,
        apellidoPaternoEmpl: e.apellido_paterno_empl,
        apellidoMaternoEmpl: e.apellido_materno_empl,
        fechaNacimientoEmpl: formatDate(e.fecha_nacimiento_empl),
        edadEmpl: e.edad_empl,
        fechaInicioEmpl: formatDate(e.fecha_inicio_empl),
        fechaTerminoEmpl: formatDate(e.fecha_termino_empl),
        tituloEmpl: e.titulo_empl,
        rmuEmpl: Number(e.rmu_empl) || 1,
        estadoEmpl: e.estado_empl
      });
      
      console.log('Datos cargados:', this.formData.value);
    });
  }

  protected calcularEdad() {
    const fecha = this.formData.controls.fechaNacimientoEmpl.value;
    if (!fecha) return;

    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    this.formData.controls.edadEmpl.setValue(edad);
  }

  protected guardar(): void {
    if(!this.formData.invalid){
      const data = this.formData.getRawValue() as IEmpleado;
      if(this.isAdd){
        data.ideEmpl = -1;
        this._empleadosService.insertar(data).subscribe(
          (res) => {
            Swal.fire({
              title: "Empleado registrado :)",
              text: "El empleado fue guardado correctamente",
              icon: "success"
            });
            this.location.back();
            this.resetForm();
          }
        );
      }else{
        Swal.fire({
          title: "¿Está seguro de modificar este empleado?",
          text: "Los cambios realizados se registrarán!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, de acuerdo"
        }).then((result) => {
          if (result.isConfirmed) {
            data.ideEmpl = this.idParam;
            this._empleadosService.actualizar(this.idParam, data).subscribe(
              (res) => {
                Swal.fire({
                  title: "Empleado actualizado :)",
                  text: "El empleado fue actualizado correctamente",
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
