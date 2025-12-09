import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";

const IMPORTS = [
  UiTextFieldComponent, 
  ReactiveFormsModule, 
  UiButtonComponent, 
  UiDatetimePickerComponent
];

@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {
  
  private _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected formData!: FormGroup;
  private isAdd: boolean = true;
  private id: number = -1;

  constructor() {
    this.configForm();
  }

  protected configForm(): void {
    const value = this._route.snapshot.params['id'];
    if(!value){
      this.formData = this.formBuilder.group({
        nombre: [null, [Validators.required], []],
        responsable: ['', [Validators.required], []],
        direccion: ['', [Validators.required], []],
        telefono: ['', [Validators.required], []],
        email: ['', [Validators.required], []],
        fecha_contrato: ['', [Validators.required], []],
      });
    }else{
      this.id = value;
      this.isAdd = false;
      this.formData = this.formBuilder.group({
        nombre: ['empPrueba', [Validators.required], []],
        responsable: ['userPrueba', [Validators.required], []],
        direccion: ['Machala bonita :)', [Validators.required], []],
        telefono: ['0981347564', [Validators.required], []],
        email: ['prueba@gmail.com', [Validators.required], []],
        fecha_contrato: ['30/11/2025', [Validators.required], []],
      });
    }
    console.log(this.formData);
  }

  protected guardar(): void {
    if(!this.formData.invalid){

    }else{

    }
    console.table(this.formData.value);
    //this.formData.reset();
  }
}
