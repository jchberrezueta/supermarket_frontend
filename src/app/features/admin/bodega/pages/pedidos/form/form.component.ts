import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '@shared/components/datetime-picker/datetime-picker.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiTableListComponent } from '@shared/components/table-list/table-list.component';

import { IComboBoxOption } from '@shared/models/combo_box_option';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiInputBoxComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent,
    UiButtonComponent,
    UiTableListComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class PedidoFormComponent {

  private fb = inject(FormBuilder);
  private location = inject(Location);

  /* =========================
     FLAGS
  ========================== */
  protected isAddPedido = true;
  protected isAddDetalle = true;

  /* =========================
     COMBOS
  ========================== */
  protected empresas!: IComboBoxOption[];
  protected productos!: IComboBoxOption[];

  /* =========================
     CABECERA FORM
  ========================== */
  protected pedidoForm = this.fb.group({
    idePedi: [{ value: -1, disabled: true }],
    ideEmpr: [-1, Validators.required],
    fechaPedi: ['', Validators.required],
    fechaEntrPedi: ['', Validators.required],
    motivoPedi: ['peticion'],
    observacionPedi: ['']
  });

  /* =========================
     DETALLE FORM
  ========================== */
  protected detalleForm = this.fb.group({
    ideDetaPedi: [-1],
    ideProd: [-1, Validators.required],
    cantidadProd: [1, Validators.required],
    precioUnitarioProd: [0, Validators.required],
    dctoCompraProd: [0],
    dctoCaducProd: [0],
    ivaProd: [0]
  });

  /* =========================
     LISTA TEMPORAL DETALLE
  ========================== */
  protected detalles: any[] = [];

  /* =========================
     CALCULOS VISUALES
  ========================== */
  protected bruto = 0;
  protected neto = 0;
  protected total = 0;

  constructor() {
    // loadEmpresas()
    // loadProductos()
  }

  /* =========================
     CALCULO DETALLE
  ========================== */
  protected calcularDetalle() {
    const v = this.detalleForm.value;

    const subtotal = v.cantidadProd! * v.precioUnitarioProd!;
    const dctoCompra = subtotal * (v.dctoCompraProd! / 100);
    const dctoCaduc = subtotal * (v.dctoCaducProd! / 100);

    this.bruto = subtotal;
    this.neto = subtotal - dctoCompra - dctoCaduc;
    this.total = this.neto + (this.neto * (v.ivaProd! / 100));
  }

  /* =========================
     INSERT / UPDATE DETALLE
  ========================== */
  protected guardarDetalle() {
    this.calcularDetalle();

    const data = {
      ...this.detalleForm.value,
      subtotalProd: this.bruto,
      totalProd: this.total,
      estadoDetaPedi: 'progreso'
    };

    if (this.isAddDetalle) {
      data.ideDetaPedi = -1;
      this.detalles.push(data);
    } else {
      const index = this.detalles.findIndex(d => d.ideDetaPedi === data.ideDetaPedi);
      this.detalles[index] = data;
    }

    this.clearDetalle();
  }

  protected cargarDetalle(row: any) {
    this.isAddDetalle = false;
    this.detalleForm.patchValue(row);
    this.calcularDetalle();
  }

  protected clearDetalle() {
    this.isAddDetalle = true;
    this.detalleForm.reset({
      ideDetaPedi: -1,
      cantidadProd: 1,
      dctoCompraProd: 0,
      dctoCaducProd: 0,
      ivaProd: 0
    });
    this.bruto = this.neto = this.total = 0;
  }

  /* =========================
     GUARDAR PEDIDO COMPLETO
  ========================== */
  protected guardarPedido() {
    const payload = {
      pedido: this.pedidoForm.getRawValue(),
      detalles: this.detalles
    };

    // backend decide:
    // - ideDetaPedi === -1 → INSERT
    // - ideDetaPedi > 0 → UPDATE
  }

  protected cancelar() {
    this.location.back();
  }
}
