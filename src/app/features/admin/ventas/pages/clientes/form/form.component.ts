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
import { IResultDataCreate } from '@core/models';

type ClienteFormGroup = FormGroupOf<ICliente>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiButtonComponent,
    UiDatetimePickerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
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
    { label: 'No', value: 'no' },
  ];

  protected isAdd = true;
  private idParam = -1;

  ngOnInit(): void {
    this.initForm();

    this.formData
      .get('fechaNacimientoClie')!
      .valueChanges.subscribe((value) => {
        const edad = this.calcularEdad(value);
        this.formData.get('edadClie')?.setValue(edad, { emitEvent: false });
      });

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
      apellidoMaternoClie: [''],
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
          apellidoMaternoClie: c.apellido_materno_clie || '',
        });
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide(),
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire(
        'Formulario incompleto',
        'Revise los datos obligatorios.',
        'info',
      );

      return;
    }

    const raw = this.formData.getRawValue();

    const data: ICliente = {
      ...raw,
      cedulaClie: raw.cedulaClie.trim(),
      telefonoClie: raw.telefonoClie.trim(),
      primerNombreClie: raw.primerNombreClie.trim(),
      apellidoPaternoClie: raw.apellidoPaternoClie.trim(),
      emailClie: raw.emailClie.trim().toLowerCase(),
      segundoNombreClie: raw.segundoNombreClie?.trim() || null,
      apellidoMaternoClie: raw.apellidoMaternoClie?.trim() || null,
    };

    if (this.isAdd) {
      const { ideClie: _ideClie, ...createData } = data;

      this._loadingService.show();

      this._clientesService.insertar(createData).subscribe({
        next: (response) => {
          this._loadingService.hide();

          this.procesarRespuesta(response, 'Cliente registrado');
        },

        error: (error) => {
          this._loadingService.hide();

          void Swal.fire(
            'No se pudo registrar',
            this.obtenerErrorHttp(error),
            'error',
          );
        },
      });

      return;
    }

    void Swal.fire({
      title: '¿Actualizar cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      data.ideClie = this.idParam;

      this._loadingService.show();

      this._clientesService.actualizar(this.idParam, data).subscribe({
        next: (response) => {
          this._loadingService.hide();

          this.procesarRespuesta(response, 'Cliente actualizado');
        },

        error: (error) => {
          this._loadingService.hide();

          void Swal.fire(
            'No se pudo actualizar',
            this.obtenerErrorHttp(error),
            'error',
          );
        },
      });
    });
  }

  protected calcularEdad(fecha: string | Date): number {
    if (!fecha) return 0;

    const fechaNac = new Date(fecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  protected cancelar() {
    Swal.fire({
      title: '¿Cancelar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    }).then((r) => {
      if (r.isConfirmed) {
        this.resetForm();
        this.location.back();
      }
    });
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }

  private procesarRespuesta(response: IResultDataCreate, titulo: string): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensaje(
      response.p_response,

      success
        ? 'Operación completada correctamente.'
        : 'No se pudo completar la operación.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? titulo : 'Operación rechazada',

      text: message,
    }).then(() => {
      if (success) {
        this.location.back();
      }
    });
  }

  private obtenerMensaje(
    response: string | undefined,
    fallback: string,
  ): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as {
        message?: string;
      };

      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }

  private obtenerErrorHttp(error: unknown): string {
    const httpError = error as {
      error?: {
        message?: string | string[];
      };
      message?: string;
    };

    const message = httpError.error?.message;

    return Array.isArray(message)
      ? message.join(' ')
      : (message ?? httpError.message ?? 'Ocurrió un error inesperado.');
  }
}
