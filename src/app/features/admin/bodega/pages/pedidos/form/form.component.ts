import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';

import { FormGroupOf } from '@core/utils/utilities';
import { IPedido, IPedidoResult } from '@models';
import { PedidosService, EmpresasService } from '@services/index';
import Swal from 'sweetalert2';

const IMPORTS = [
  UiTextFieldComponent, 
  UiTextAreaComponent,
  UiDatetimePickerComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  ReactiveFormsModule, 
];

type PedidoFormGroup = FormGroupOf<IPedido>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent implements OnInit {
  
  protected empresas!: IComboBoxOption[];
  protected estados!: IComboBoxOption[];
  protected motivos!: IComboBoxOption[];
  
  private readonly _route = inject(ActivatedRoute);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _empresasService = inject(EmpresasService);
  private readonly formBuilder = inject(FormBuilder);
  public location = inject(Location);
  
  protected formData!: PedidoFormGroup;
  private initialFormValue!: IPedido;
  protected isAdd: boolean = true;
  private idParam: number = -1;

  constructor() {
    this.loadCombos();
  }

  ngOnInit() {
    const idParam = this._route.snapshot.params['id'];
    this.initForm();
    if(idParam){
      this.setData(idParam);
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      idePedi: [{ value: -1, disabled: true }, [Validators.required]],        
      ideEmpr: [-1, [Validators.required]],
      fechaPedi: ['', [Validators.required]],
      fechaEntrPedi: ['', [Validators.required]],
      cantidadTotalPedi: [0, [Validators.required, Validators.min(0)]],
      totalPedi: [0, [Validators.required, Validators.min(0)]],
      estadoPedi: ['', [Validators.required]],
      motivoPedi: ['', [Validators.required]],
      observacionPedi: ['']
    }) as PedidoFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private setData(idParam: number) {
    this._pedidosService.buscar(idParam).subscribe(
      (res) => {
        const pedido = res.data[0] as IPedidoResult;
        this.idParam = pedido.ide_pedi;
        this.isAdd = false;
        this.formData.patchValue({
          idePedi: pedido.ide_pedi,
          ideEmpr: pedido.ide_empr,
          fechaPedi: pedido.fecha_pedi,
          fechaEntrPedi: pedido.fecha_entr_pedi,
          cantidadTotalPedi: pedido.cantidad_total_pedi,
          totalPedi: pedido.total_pedi,
          estadoPedi: pedido.estado_pedi,
          motivoPedi: pedido.motivo_pedi,
          observacionPedi: pedido.observacion_pedi
        });
      }
    );
  }

  private loadCombos() {
    this._empresasService.listarComboEmpresas().subscribe(
      (res: IComboBoxOption[]) => {
        this.empresas = res;
      }
    );

    this._pedidosService.listarComboEstados().subscribe(
      (res: IComboBoxOption[]) => {
        this.estados = res;
      }
    );

    this._pedidosService.listarComboMotivos().subscribe(
      (res: IComboBoxOption[]) => {
        this.motivos = res;
      }
    );
  }

  protected guardar(): void {
    if(!this.formData.invalid){
      const pedido = this.formData.getRawValue() as IPedido;
      const pedidoCompleto: any = {
        cabeceraPedido: pedido,
        detallePedido: []
      };
      
      if(this.isAdd){
        pedidoCompleto.cabeceraPedido.idePedi = -1;
        this._pedidosService.insertar(pedidoCompleto).subscribe(
          () => {
            Swal.fire({
              title: "Pedido registrado :)",
              text: "El pedido fue guardado correctamente",
              icon: "success"
            });
            this.location.back();
            this.resetForm();
          }
        );
      }else{
        Swal.fire({
          title: "¿Está seguro de modificar este pedido?",
          text: "Los cambios realizados se registrarán!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, de acuerdo"
        }).then((result) => {
          if (result.isConfirmed) {
            pedidoCompleto.cabeceraPedido.idePedi = this.idParam;
            this._pedidosService.actualizar(this.idParam, pedidoCompleto).subscribe(
              () => {
                Swal.fire({
                  title: "Pedido actualizado :)",
                  text: "El pedido fue actualizado correctamente",
                  icon: "success"
                });
                this.location.back();
                this.resetForm();
              }
            );
          }
        });
      }
    }else{
      Swal.fire({
        icon: "info",
        title: "Oops... Faltan datos",
        text: "Revise por favor la información ingresada"
      });
    }
  }

  protected cancelar(): void {
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
