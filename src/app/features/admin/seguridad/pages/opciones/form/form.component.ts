import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { EnumEstadosOpcion, IOpciones, IOpcionesResult, ListEstadosOpcion } from '@models';
import { OpcionesService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';

import Swal from 'sweetalert2';

type OpcionFormGroup = FormGroupOf<IOpciones>;

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
  private readonly _opcionesService = inject(OpcionesService);
  public location = inject(Location);

  protected formData!: OpcionFormGroup;
  private initialFormValue!: IOpciones;

  protected isAdd = true;
  private idParam = -1;

  protected readonly estadosOptions = ListEstadosOpcion;

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
      ideOpci: [{ value: -1, disabled: true }, Validators.required],
      nombreOpci: ['', Validators.required],
      rutaOpci: ['', Validators.required],
      nivelOpci: [0, [Validators.required, Validators.min(0)]],
      padreOpci: [null],
      iconoOpci: [''],
      activoOpci: [EnumEstadosOpcion.SI, Validators.required],
      descripcionOpci: ['', Validators.required]
    }) as OpcionFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._opcionesService.buscar(id).subscribe(res => {
      const c = res.data[0] as IOpcionesResult;
      this.formData.patchValue({
        ideOpci: c.ide_opci,
        nombreOpci: c.nombre_opci,
        rutaOpci: c.ruta_opci,
        nivelOpci: c.nivel_opci,
        padreOpci: c.padre_opci,
        iconoOpci: c.icono_opci,
        activoOpci: c.activo_opci,
        descripcionOpci: c.descripcion_opci
      });
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as IOpciones;

      if (this.isAdd) {
        data.ideOpci = -1;
        this._opcionesService.insertar(data).subscribe(() => {
          Swal.fire('Opción registrada', '', 'success');
          this.location.back();
          this.resetForm();
        });
      } else {
        Swal.fire({
          title: '¿Actualizar Opción?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí'
        }).then(r => {
          if (r.isConfirmed) {
            data.ideOpci = this.idParam;
            this._opcionesService.actualizar(this.idParam, data).subscribe(() => {
              Swal.fire('Opción actualizada', '', 'success');
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
