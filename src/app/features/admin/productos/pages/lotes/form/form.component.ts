import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { EnumEstadosLote, ILote, ILoteResult, ListEstadosLote } from '@models';
import { LotesService, ProductosService } from '@services/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';

import Swal from 'sweetalert2';

type LoteFormGroup = FormGroupOf<ILote>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiButtonComponent,
    UiComboBoxComponent,
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
  private readonly _productosService = inject(ProductosService);
  public location = inject(Location);

  protected formData!: LoteFormGroup;
  private initialFormValue!: ILote;

  protected isAdd = true;
  private idParam = -1;

  protected opcionesProductos: IComboBoxOption[] = [];
  protected readonly estadosOptions = ListEstadosLote;

  ngOnInit(): void {
    this.loadComboProductos();
    this.initForm();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private loadComboProductos() {
    this._productosService.listarComboProductos().subscribe(
      (res) => {
        this.opcionesProductos = res;
      }
    );
  }

  private initForm() {
    this.formData = this._fb.group({
      ideLote: [{ value: -1, disabled: true }, Validators.required],
      ideProd: [0, Validators.required],
      fechaCaducidadLote: ['', Validators.required],
      stockLote: [0, [Validators.required, Validators.min(0)]],
      estadoLote: [EnumEstadosLote.CORRECTO, Validators.required]
    }) as LoteFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  private setData(id: number) {
    this._lotesService.buscar(id).subscribe(res => {
      const l = res.data[0] as ILoteResult;
      this.formData.patchValue({
        ideLote: l.ide_lote,
        ideProd: l.ide_prod,
        fechaCaducidadLote: this.formatDate(l.fecha_caducidad_lote),
        stockLote: l.stock_lote,
        estadoLote: l.estado_lote
      });
    });
  }

  protected guardar() {
    if (this.formData.valid) {
      const data = this.formData.getRawValue() as ILote;

      if (this.isAdd) {
        data.ideLote = -1;
        this._lotesService.insertar(data).subscribe(() => {
          Swal.fire('Lote registrado', '', 'success');
          this.location.back();
          this.resetForm();
        });
      } else {
        Swal.fire({
          title: '¿Actualizar Lote?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí'
        }).then(r => {
          if (r.isConfirmed) {
            data.ideLote = this.idParam;
            this._lotesService.actualizar(this.idParam, data).subscribe(() => {
              Swal.fire('Lote actualizado', '', 'success');
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
