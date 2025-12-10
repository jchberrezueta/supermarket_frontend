import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { FormGroupOf } from '@core/utils/utilities';
import { RestService } from '@core/services/rest.service';
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { CEmpresa, IEmpresa, IEmpresaResult, ListEstadosEmpresa } from '@models';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';

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
  styleUrl: './form.component.scss'
})
export default class FormComponent {
  
  protected readonly estadosEmpresa: IComboBoxOption[] = ListEstadosEmpresa;
  private readonly _route = inject(ActivatedRoute);
  private readonly _restService = inject(RestService);
  private readonly formBuilder= inject(FormBuilder);
  protected formData!: EmpresaFormGroup;
  private isAdd: boolean = true;
  private idParam: number = -1;

  constructor() {
    this.configForm();
  }

  protected configForm(): void {
    const idParam = this._route.snapshot.params['id'];
    this.formData = this.formBuilder.group({
        ideEmp: [-1, [], []],
        nombreEmp: ['', [Validators.required], []],
        responsableEmp: ['', [Validators.required], []],
        fechaContratoEmp: ['', [Validators.required], []],
        direccionEmp: ['', [Validators.required], []],
        telefonoEmp: ['', [Validators.required], []],
        emailEmp: ['', [Validators.required], []],
        estadoEmp: ['', [Validators.required], []],
        descripcionEmp: ['', [Validators.required], []]
      }) as EmpresaFormGroup;
    if(idParam){
      this._restService.get<any>(`empresas/buscar/${idParam}`).subscribe(
        (res) => {
          const empresa = res.data[0] as IEmpresaResult;
          this.idParam = empresa.ide_empr;
          this.isAdd = false;
          this.formData.patchValue({
            ideEmp: empresa.ide_empr,
            nombreEmp: empresa.nombre_empr,
            responsableEmp: empresa.responsable_empr,
            fechaContratoEmp: empresa.fecha_contrato_empr,
            direccionEmp: empresa.direccion_empr,
            telefonoEmp: empresa.telefono_empr,
            emailEmp: empresa.email_empr,
            estadoEmp: empresa.estado_empr,
            descripcionEmp: empresa.descripcion_empr
          });
        }
      )
    }
  }

  protected guardar(): void {
    if(!this.formData.invalid){
      const data = this.formData.value;
      if(this.isAdd){
        this._restService.post<any>('empresas/insertar', data).subscribe(
          (res) => {
            console.log(res);
          }
        );
      }else{
        this._restService.put<any>(`empresas/actualizar/${this.idParam}`, data).subscribe(
          (res) => {
            console.log(res);
          }
        );
      }
    }else{

    }
    //this.formData.reset();
  }
}
