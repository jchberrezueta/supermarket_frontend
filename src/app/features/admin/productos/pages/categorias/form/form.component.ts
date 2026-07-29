import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ICategoria, ICategoriaResult } from '@models';
import { CategoriasService } from '@services/index';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTextAreaComponent } from '@shared/components/text-area/text-area.component';
import { UiButtonComponent } from '@shared/components/button/button.component';

import Swal from 'sweetalert2';
import { IResultDataCreate } from '../../../../../../core/models';

type CategoriaFormGroup = FormGroupOf<ICategoria>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiTextAreaComponent,
    UiButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export default class FormComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _categoriasService = inject(CategoriasService);
  public location = inject(Location);

  protected formData!: CategoriaFormGroup;
  private initialFormValue!: ICategoria;

  protected isAdd = true;
  private idParam = -1;

  ngOnInit(): void {
    this.initForm();

    const idParam = this._route.snapshot.paramMap.get('id');

    if (idParam === null) {
      this.isAdd = true;
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 0) {
      void Swal.fire(
        'Identificador inválido',
        'El identificador recibido no es válido.',
        'error',
      ).then(() => {
        this.location.back();
      });

      return;
    }

    this.isAdd = false;
    this.idParam = id;
    this.setData(id);
  }

  private initForm() {
    this.formData = this._fb.group({
      ideCate: [{ value: -1, disabled: true }, Validators.required],
      nombreCate: ['', Validators.required],
      descripcionCate: ['', Validators.required],
    }) as CategoriaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._categoriasService.buscar(id).subscribe((res) => {
      const c = res.data[0] as ICategoriaResult;
      this.formData.patchValue({
        ideCate: c.ide_cate,
        nombreCate: c.nombre_cate,
        descripcionCate: c.descripcion_cate,
      });
    });
  }

  protected guardar(): void {
    this.formData.markAllAsTouched();

    if (this.formData.invalid) {
      void Swal.fire(
        'Formulario incompleto',
        'Revise los campos obligatorios.',
        'info',
      );

      return;
    }

    const raw = this.formData.getRawValue();

    const data: ICategoria = {
      ...raw,

      nombreCate: raw.nombreCate.trim(),

      descripcionCate: raw.descripcionCate.trim(),
    };

    if (this.isAdd) {
      const { ideCate: _ideCate, ...createData } = data;

      this._categoriasService.insertar(createData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Categoría registrada');
        },

        error: (error) => {
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
      title: '¿Actualizar categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const updateData: ICategoria = {
        ...data,
        ideCate: this.idParam,
      };

      this._categoriasService.actualizar(this.idParam, updateData).subscribe({
        next: (response) => {
          this.procesarRespuesta(response, 'Categoría actualizada');
        },

        error: (error) => {
          void Swal.fire(
            'No se pudo actualizar',
            this.obtenerErrorHttp(error),
            'error',
          );
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
