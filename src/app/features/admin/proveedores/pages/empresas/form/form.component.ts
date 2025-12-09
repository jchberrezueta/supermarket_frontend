import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { IEmpresa, IEmpresaResult } from '@models/proveedores';
import { FormGroupOf } from '@core/utils/utilities';
import { RestService } from '@core/services/rest.service';
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { Empresa } from '@shared/entities/empresa.class';

const IMPORTS = [
  UiTextFieldComponent, 
  UiTextAreaComponent,
  ReactiveFormsModule, 
  UiButtonComponent, 
  UiDatetimePickerComponent
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
  
  private _route = inject(ActivatedRoute);
  private _restService = inject(RestService);
  private formBuilder= inject(FormBuilder);
  protected formData!: EmpresaFormGroup;
  private isAdd: boolean = true;
  private id: number = -1;

  constructor() {
    this.configForm();
  }

  protected configForm(): void {
    const idEmp = this._route.snapshot.params['id'];
    this.formData = this.formBuilder.group({
        nombreEmp: ['', [Validators.required], []],
        responsableEmp: ['', [Validators.required], []],
        fechaContratoEmp: ['', [Validators.required], []],
        direccionEmp: ['', [Validators.required], []],
        telefonoEmp: ['', [Validators.required], []],
        emailEmp: ['', [Validators.required], []],
        estadoEmp: ['activo', [Validators.required], []],
        descripcionEmp: ['jsjjsjs', [Validators.required], []]
      }) as EmpresaFormGroup;
    if(idEmp){
      this._restService.get<any>(`empresas/buscar/${idEmp}`).subscribe(
        (res) => {
          const empresa = res.data[0] as IEmpresaResult;
          this.id = idEmp;
          this.isAdd = false;
          this.formData.patchValue({
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
      const {...data} = this.formData.value;
      /*const empresa: IEmpresa = {
        nombreEmp: data.nombreEmp,
        responsableEmp: data.responsableEmp,
        fechaContratoEmp: data.fechaContratoEmp,
        direccionEmp: data.direccionEmp,
        telefonoEmp: data.telefonoEmp,
        emailEmp: data.emailEmp,
        estadoEmp: data.estadoEmp,
        descripcionEmp: data.descripcionEmp
      }*/
      const objEmpresa = new Empresa(null, data.nombreEmp, data.responsableEmp, data.fechaContratoEmp, data.direccionEmp, data.telefonoEmp, data.emailEmp, data.estadoEmp, data.descripcionEmp);
      console.log(objEmpresa);
      if(this.isAdd){
        console.log('Insertar :)');
        this._restService.post<any>('empresas/insertar', objEmpresa).subscribe(
          (res) => {
            console.log(res);
          }
        );
      }else{
        objEmpresa.ideEmp = this.id;
        console.log('Actualizar :) ', this.id);
        this._restService.put<any>('empresas/actualizar', objEmpresa);
      }
    }else{

    }
    console.table(this.formData.value);
    //this.formData.reset();
  }
}
