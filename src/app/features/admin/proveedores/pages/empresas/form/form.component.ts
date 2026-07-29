import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { FormGroupOf } from '@core/utils/utilities';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { IEmpresa, IEmpresaResult } from '@models';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import Swal from 'sweetalert2';
import { Location, NgIf } from '@angular/common'; // 1. Importar Location
import { EmpresasService } from '@services/index';
import { IResultDataCreate } from '@core/models';

const IMPORTS = [
  UiTextFieldComponent,
  UiTextAreaComponent,
  UiDatetimePickerComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  ReactiveFormsModule,
];

type EmpresaFormGroup = FormGroupOf<IEmpresa>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent {
  protected estadosEmpresa!: IComboBoxOption[];
  private readonly _route = inject(ActivatedRoute);
  private readonly _empresasService = inject(EmpresasService);
  private readonly formBuilder = inject(FormBuilder);
  public location = inject(Location);
  protected formData!: EmpresaFormGroup;
  private initialFormValue!: IEmpresa;
  protected isAdd: boolean = true;
  private idParam: number = -1;

  constructor() {
    this.loadEstadosEmpresa();
  }

  ngOnInit(): void {
    this.initForm();

    const idParam = this._route.snapshot.paramMap.get('id');

    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 0) {
      void Swal.fire({
        icon: 'error',
        title: 'Identificador inválido',
        text: 'El identificador de la empresa no es válido.',
      }).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;

    this.setData(id);
  }
  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideEmp: [{ value: -1, disabled: true }, [Validators.required]],
      nombreEmp: ['', [Validators.required], []],
      responsableEmp: ['', [Validators.required], []],
      fechaContratoEmp: ['', [Validators.required], []],
      direccionEmp: ['', [Validators.required], []],
      telefonoEmp: ['', [Validators.required], []],
      emailEmp: ['', [Validators.required], []],
      estadoEmp: ['', [Validators.required], []],
      descripcionEmp: ['', [Validators.required], []],
    }) as EmpresaFormGroup;

    // snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number): void {
    this._empresasService.buscar(id).subscribe({
      next: (response) => {
        const empresa = response.data[0] as IEmpresaResult | undefined;

        if (!empresa) {
          void Swal.fire({
            icon: 'error',
            title: 'Empresa no encontrada',
            text: 'No se encontró la empresa solicitada.',
          }).then(() => {
            this.location.back();
          });

          return;
        }

        this.formData.patchValue({
          ideEmp: empresa.ide_empr,

          nombreEmp: empresa.nombre_empr,

          responsableEmp: empresa.responsable_empr,

          fechaContratoEmp: empresa.fecha_contrato_empr,

          direccionEmp: empresa.direccion_empr,

          telefonoEmp: empresa.telefono_empr,

          emailEmp: empresa.email_empr,

          estadoEmp: empresa.estado_empr,

          descripcionEmp: empresa.descripcion_empr,
        });
      },

      error: (error) => {
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar la empresa',
          text: this.obtenerErrorHttp(error),
        }).then(() => {
          this.location.back();
        });
      },
    });
  }
  private loadEstadosEmpresa() {
    this._empresasService.listarEstados().subscribe((res) => {
      this.estadosEmpresa = res;
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Revise la información ingresada.',
      });

      return;
    }

    const raw = this.formData.getRawValue();

    const commonData = {
      nombreEmp: raw.nombreEmp.trim(),

      responsableEmp: raw.responsableEmp.trim(),

      fechaContratoEmp: raw.fechaContratoEmp,

      direccionEmp: raw.direccionEmp.trim(),

      telefonoEmp: raw.telefonoEmp.trim(),

      emailEmp: raw.emailEmp.trim().toLowerCase(),

      estadoEmp: raw.estadoEmp,

      descripcionEmp: raw.descripcionEmp?.trim() ?? '',
    };

    if (this.isAdd) {
      const body: Omit<IEmpresa, 'ideEmp'> = {
        ...commonData,
      };

      this._empresasService.insertar(body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Empresa registrada');
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
      title: '¿Actualizar empresa?',
      text: 'Los cambios serán guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const body: IEmpresa = {
        ideEmp: this.idParam,

        ...commonData,
      };

      this._empresasService.actualizar(this.idParam, body).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Empresa actualizada');
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

  protected cancelar(): void {
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

  private procesarRespuesta(
    response: IResultDataCreate,
    successTitle: string,
  ): void {
    const success = Number(response.p_result) === 1;

    const message = this.obtenerMensajeLegacy(
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

  private obtenerMensajeLegacy(
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
