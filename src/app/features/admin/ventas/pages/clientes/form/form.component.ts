import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ICliente, IClienteResult } from '@models';
import { ClientesService } from '@services/clientes.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type ClienteFormGroup = FormGroupOf<ICliente>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiButtonComponent,
    UiDatetimePickerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _clientesService = inject(ClientesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected formData!: ClienteFormGroup;
  private initialFormValue!: ICliente;

  protected opcionesSiNo: IComboBoxOption[] = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' }
  ];

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
      ideClie: [{ value: -1, disabled: true }, Validators.required],
      cedulaClie: ['', Validators.required],
      fechaNacimientoClie: ['', Validators.required],
      edadClie: [0, [Validators.required, Validators.min(1)]],
      telefonoClie: ['', Validators.required],
      primerNombreClie: ['', Validators.required],
      apellidoPaternoClie: ['', Validators.required],
      emailClie: ['', [Validators.required, Validators.email]],
      esSocio: ['no', Validators.required],
      esTerceraEdad: ['no', Validators.required],
      segundoNombreClie: [''],
      apellidoMaternoClie: ['']
    }) as ClienteFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._loadingService.show();
    this._clientesService.buscar(id).subscribe({
      next: (res) => {
        const c = res.data[0] as IClienteResult;
        this.formData.patchValue({
          ideClie: c.ide_clie,
          cedulaClie: c.cedula_clie,
          fechaNacimientoClie: c.fecha_nacimiento_clie,
          edadClie: c.edad_clie,
          telefonoClie: c.telefono_clie,
          primerNombreClie: c.primer_nombre_clie,
          apellidoPaternoClie: c.apellido_paterno_clie,
          emailClie: c.email_clie,
          esSocio: c.es_socio,
          esTerceraEdad: c.es_tercera_edad,
          segundoNombreClie: c.segundo_nombre_clie || '',
          apellidoMaternoClie: c.apellido_materno_clie || ''
        });
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected guardar() {
    if (!this.formData.valid) {
      Swal.fire('Oops', 'Faltan datos obligatorios', 'info');
      return;
    }

    const data = this.formData.getRawValue() as ICliente;

    if (this.isAdd) {
      data.ideClie = -1;
      this._loadingService.show();
      this._clientesService.insertar(data).subscribe({
        next: () => {
          this._loadingService.hide();
          Swal.fire('Cliente registrado', 'El cliente fue guardado correctamente', 'success');
          this.location.back();
          this.resetForm();
        },
        error: () => this._loadingService.hide()
      });
    } else {
      Swal.fire({
        title: '¿Actualizar cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar'
      }).then(r => {
        if (r.isConfirmed) {
          data.ideClie = this.idParam;
          this._loadingService.show();
          this._clientesService.actualizar(this.idParam, data).subscribe({
            next: () => {
              this._loadingService.hide();
              Swal.fire('Cliente actualizado', 'Cambios guardados', 'success');
              this.location.back();
              this.resetForm();
            },
            error: () => this._loadingService.hide()
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
