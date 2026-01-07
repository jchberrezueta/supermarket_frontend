import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IMarca, IMarcaResult } from '@models';
import { MarcasService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';

type MarcaFormGroup = FormGroupOf<IMarca>;

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
  private readonly _marcasService = inject(MarcasService);
  public location = inject(Location);

  protected formData!: MarcaFormGroup;
  private initialFormValue!: IMarca;

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
      ideMarc: [{ value: -1, disabled: true }, Validators.required],
      nombreMarc: ['', Validators.required],
      paisOrigenMarc: ['', Validators.required],
      calidadMarc: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      descripcionMarc: ['']
    }) as MarcaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._marcasService.buscar(id).subscribe(res => {
      const m = res.data[0] as IMarcaResult;
      this.formData.patchValue({
        ideMarc: m.ide_marc,
        nombreMarc: m.nombre_marc,
        paisOrigenMarc: m.pais_origen_marc,
        calidadMarc: m.calidad_marc,
        descripcionMarc: m.descripcion_marc
      });
    });
  }

  protected guardar() {
    const data = this.formData.getRawValue() as IMarca;
    console.log(data);
    if (!this.formData.valid) {
      Swal.fire('Oops', 'Faltan datos obligatorios', 'info');
      return;
    }

    if (this.isAdd) {
      data.ideMarc = -1;
      this._marcasService.insertar(data).subscribe(() => {
        Swal.fire('Marca registrada', 'La marca fue guardada correctamente', 'success');
        this.location.back();
        this.resetForm();
      });
    } else {
      Swal.fire({
        title: '¿Actualizar marca?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar'
      }).then(r => {
        if (r.isConfirmed) {
          data.ideMarc = this.idParam;
          this._marcasService.actualizar(this.idParam, data).subscribe(() => {
            Swal.fire('Marca actualizada', 'Cambios guardados', 'success');
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí'
    }).then(r => {
      if (r.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }
}
