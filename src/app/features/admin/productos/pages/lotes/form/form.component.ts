import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { ILote, ILoteResult } from '@models';
import { LotesService } from '@services/lotes.service';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type LoteFormGroup = FormGroupOf<ILote>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiButtonComponent,
    UiInputBoxComponent,
    UiDatetimePickerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _lotesService = inject(LotesService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected formData!: LoteFormGroup;
  private initialFormValue!: ILote;

  protected productos: IComboBoxOption[] = [];
  protected estados: IComboBoxOption[] = [];

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

  private loadCombos(): void {
    this._lotesService.listarComboProductos().subscribe(res => {
      this.productos = res;
    });
    this._lotesService.listarComboEstados().subscribe(res => {
      this.estados = res;
    });
  }

  private initForm() {
    this.formData = this._fb.group({
      ideLote: [{ value: -1, disabled: true }, Validators.required],
      ideProd: [-1, Validators.required],
      fechaCaducidadLote: ['', Validators.required],
      stockLote: [0, [Validators.required, Validators.min(0)]],
      estadoLote: ['correcto', Validators.required]
    }) as LoteFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(id: number) {
    this._loadingService.show();
    this._lotesService.buscar(id).subscribe({
      next: (res) => {
        const l = res.data[0] as ILoteResult;
        this.formData.patchValue({
          ideLote: l.ide_lote,
          ideProd: l.ide_prod,
          fechaCaducidadLote: l.fecha_caducidad_lote,
          stockLote: l.stock_lote,
          estadoLote: l.estado_lote
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

    const data = this.formData.getRawValue() as ILote;

    if (this.isAdd) {
      data.ideLote = -1;
      this._loadingService.show();
      this._lotesService.insertar(data).subscribe({
        next: () => {
          this._loadingService.hide();
          Swal.fire('Lote registrado', 'El lote fue guardado correctamente', 'success');
          this.location.back();
          this.resetForm();
        },
        error: () => this._loadingService.hide()
      });
    } else {
      Swal.fire({
        title: '¿Actualizar lote?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar'
      }).then(r => {
        if (r.isConfirmed) {
          data.ideLote = this.idParam;
          this._loadingService.show();
          this._lotesService.actualizar(this.idParam, data).subscribe({
            next: () => {
              this._loadingService.hide();
              Swal.fire('Lote actualizado', 'Cambios guardados', 'success');
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
