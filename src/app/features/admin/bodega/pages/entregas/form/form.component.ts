import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { FormGroupOf } from '@core/utils/utilities';
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { IEntrega, IEntregaResult, EnumEstadoEntrega, IEntregaCompleta } from '@models';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import Swal from 'sweetalert2'
import { Location, CommonModule } from '@angular/common';
import { EntregasService, ProveedoresService, PedidosService } from '@services/index';
import { forkJoin } from 'rxjs';

const IMPORTS = [
  CommonModule,
  UiTextFieldComponent,
  UiTextAreaComponent,
  UiDatetimePickerComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  ReactiveFormsModule,
];

type EntregaFormGroup = FormGroupOf<IEntrega>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  protected estadosEntrega: IComboBoxOption[] = [];
  protected proveedores: IComboBoxOption[] = [];
  protected pedidos: IComboBoxOption[] = [];

  private readonly _route = inject(ActivatedRoute);
  private readonly _entregasService = inject(EntregasService);
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _pedidosService = inject(PedidosService);
  private readonly formBuilder = inject(FormBuilder);
  public location = inject(Location);

  protected formData!: EntregaFormGroup;
  private initialFormValue!: IEntrega;
  protected isAdd: boolean = true;
  private idParam: number = -1;

  ngOnInit() {
    this.initForm();
    this.loadCombos();
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      ideEntr: [{ value: -1, disabled: true }, [Validators.required]],
      idePedi: [0, [Validators.required]],
      ideProv: [0, [Validators.required]],
      fechaEntr: ['', [Validators.required]],
      cantidadTotalEntr: [1, [Validators.required, Validators.min(1)]],
      totalEntr: [0, [Validators.required, Validators.min(0)]],
      estadoEntr: [EnumEstadoEntrega.INCOMPLETO, [Validators.required]],
      observacionEntr: ['Ninguna', []]
    }) as EntregaFormGroup;

    // snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }

  private loadCombos() {
    const idParam = this._route.snapshot.params['id'];

    forkJoin({
      estados: this._entregasService.listarComboEstados(),
      proveedores: this._proveedoresService.listarComboProveedores(),
      pedidos: this._pedidosService.listarComboPedidos()
    }).subscribe({
      next: (res) => {
        this.estadosEntrega = res.estados;
        this.proveedores = res.proveedores;
        this.pedidos = res.pedidos;

        // Cargar datos si es edición
        if (idParam) {
          this.setData(+idParam);
        }
      },
      error: (err) => {
        console.error('Error cargando combos:', err);
      }
    });
  }

  private setData(idParam: number) {
    this._entregasService.buscar(idParam).subscribe(
      (res) => {
        const entrega = res.data[0] as IEntregaResult;
        this.idParam = entrega.ide_entr;
        this.isAdd = false;
        this.formData.patchValue({
          ideEntr: entrega.ide_entr,
          idePedi: entrega.ide_pedi,
          ideProv: entrega.ide_prov,
          fechaEntr: entrega.fecha_entr,
          cantidadTotalEntr: entrega.cantidad_total_entr,
          totalEntr: entrega.total_entr,
          estadoEntr: entrega.estado_entr,
          observacionEntr: entrega.observacion_entr
        });
      }
    )
  }

  protected guardar(): void {
    if (!this.formData.invalid) {
      const data = this.formData.getRawValue() as IEntrega;
      // Convertir valores a números
      data.cantidadTotalEntr = +data.cantidadTotalEntr;
      data.totalEntr = +data.totalEntr;

      const body: IEntregaCompleta = {
        cabeceraEntrega: data,
        detalleEntrega: []
      };

      if (this.isAdd) {
        body.cabeceraEntrega.ideEntr = -1;
        this._entregasService.insertar(body).subscribe(
          (res) => {
            Swal.fire({
              title: "Entrega registrada :)",
              text: "La entrega fue guardada correctamente",
              icon: "success"
            });
            this.location.back();
            this.resetForm();
          }
        );
      } else {
        Swal.fire({
          title: "¿Está seguro de modificar esta entrega?",
          text: "Los cambios realizados se registrarán!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, de acuerdo"
        }).then((result) => {
          if (result.isConfirmed) {
            body.cabeceraEntrega.ideEntr = this.idParam;
            this._entregasService.actualizar(this.idParam, body).subscribe(
              (res) => {
                Swal.fire({
                  title: "Entrega actualizada :)",
                  text: "La entrega fue actualizada correctamente",
                  icon: "success"
                });
                this.location.back();
                this.resetForm();
              }
            );
          }
        });
      }
    } else {
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
