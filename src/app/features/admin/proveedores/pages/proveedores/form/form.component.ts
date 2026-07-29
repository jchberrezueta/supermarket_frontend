import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { EnumEstadosProveedor, IProveedor, IProveedorResult } from '@models';
import { ProveedoresService, EmpresasService } from '@services/index';
import { UiTextFieldComponent } from '../../../../../../shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '../../../../../../shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '../../../../../../shared/components/datetime-picker/datetime-picker.component';
import { UiButtonComponent } from '../../../../../../shared/components/button/button.component';
import Swal from 'sweetalert2';
import { IResultDataCreate } from '@core/models';

type ProveedorFormGroup = FormGroupOf<IProveedor>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent,
    UiButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent {
  protected estadosProveedor: IComboBoxOption[] = [];
  protected empresas: IComboBoxOption[] = [];
  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _empresasService = inject(EmpresasService);
  public location = inject(Location);

  protected formData!: ProveedorFormGroup;
  private initialFormValue!: IProveedor;

  protected isAdd = true;
  private idParam = -1;

  constructor() {
    this.loadEmpresas();
    this.loadEstadosProveedor();
  }

  ngOnInit(): void {
    this.initForm();
    this.formData
      .get('fechaNacimientoProv')!
      .valueChanges.subscribe((value) => {
        const edad = this.calcularEdad(value);
        this.formData.get('edadProv')?.setValue(edad, { emitEvent: false });
      });

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private initForm(): void {
    this.formData = this._fb.group({
      ideProv: [
        {
          value: -1,
          disabled: true,
        },
        Validators.required,
      ],

      ideEmpr: [-1, [Validators.required, Validators.min(0)]],

      cedulaProv: ['', Validators.required],

      primerNombreProv: ['', Validators.required],

      segundoNombreProv: [''],

      apellidoPaternoProv: ['', Validators.required],

      apellidoMaternoProv: [''],

      fechaNacimientoProv: ['', Validators.required],

      edadProv: [0, [Validators.required, Validators.min(1)]],

      telefonoProv: ['', Validators.required],

      emailProv: ['', [Validators.required, Validators.email]],

      estadoProv: [EnumEstadosProveedor.ACTIVO, Validators.required],

      cargoProv: [''],
    }) as ProveedorFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }
  private loadEstadosProveedor() {
    this._proveedoresService.listarEstadosProveedor().subscribe((res) => {
      this.estadosProveedor = res;
    });
  }

  private loadEmpresas() {
    this._empresasService.listarComboEmpresasActivas().subscribe((res) => {
      this.empresas = res;
    });
  }

  private setData(id: number) {
    this._proveedoresService.buscar(id).subscribe((res) => {
      const p = res.data[0] as IProveedorResult;
      this.formData.patchValue({
        ideProv: p.ide_prov,
        ideEmpr: p.ide_empr,
        cedulaProv: p.cedula_prov,
        primerNombreProv: p.primer_nombre_prov,
        segundoNombreProv: p.segundo_nombre_prov,
        apellidoPaternoProv: p.apellido_paterno_prov,
        apellidoMaternoProv: p.apellido_materno_prov,
        fechaNacimientoProv: p.fecha_nacimiento_prov,
        edadProv: p.edad_prov,
        telefonoProv: p.telefono_prov,
        emailProv: p.email_prov,
        estadoProv: p.estado_prov,
        cargoProv: p.cargo_prov,
      });
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Revise la información ingresada.',
      });

      return;
    }

    const raw = this.formData.getRawValue();

    const data: IProveedor = {
      ...raw,

      cedulaProv: raw.cedulaProv.trim(),

      telefonoProv: raw.telefonoProv.trim(),

      emailProv: raw.emailProv.trim().toLowerCase(),

      primerNombreProv: raw.primerNombreProv.trim(),

      apellidoPaternoProv: raw.apellidoPaternoProv.trim(),

      segundoNombreProv: raw.segundoNombreProv?.trim() || null,

      apellidoMaternoProv: raw.apellidoMaternoProv?.trim() || null,

      cargoProv: raw.cargoProv?.trim() || undefined,
    };

    if (this.isAdd) {
      const { ideProv: _ideProv, ...createData } = data;

      this._proveedoresService.insertar(createData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Proveedor registrado');
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: this.obtenerErrorHttp(error),
          });
        },
      });

      return;
    }

    void Swal.fire({
      title: '¿Actualizar proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      data.ideProv = this.idParam;

      this._proveedoresService.actualizar(this.idParam, data).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Proveedor actualizado');
        },

        error: (error) => {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo actualizar',
            text: this.obtenerErrorHttp(error),
          });
        },
      });
    });
  }

  protected cancelar() {
    Swal.fire({
      title: 'Esta Seguro de Cancelar?',
      text: 'Los cambios realizados no se guardaran!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cancelar!',
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

  private procesarRespuesta(
    response: IResultDataCreate,
    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensaje(
      response.p_response,

      success
        ? 'Operación completada correctamente.'
        : 'No se pudo completar la operación.',
    );

    void Swal.fire({
      icon: success ? 'success' : 'error',

      title: success ? successTitle : 'Operación rechazada',

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

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message ?? httpError.message ?? 'Ocurrió un error inesperado.';
  }
}
