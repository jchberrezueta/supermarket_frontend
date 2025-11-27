import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [UiTextFieldComponent, ReactiveFormsModule, UiButtonComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {
  
  private _route = inject(ActivatedRoute);
  private formBuilder= inject(FormBuilder);
  protected formData!: FormGroup;
  private isAdd: boolean = true;
  private id: number = -1;

  ngOnInit() {
    this.configForm();
  }

  protected configForm(): void {
    const value = this._route.snapshot.params['id'];
    if(!value){
      this.formData = this.formBuilder.group({
        nombre: ['', [Validators.required], []],
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
        nombre: ['', [Validators.required], []],
        responsable: ['', [Validators.required], []],
        direccion: ['', [Validators.required], []],
        telefono: ['', [Validators.required], []],
        email: ['', [Validators.required], []],
        fecha_contrato: ['', [Validators.required], []],
      });
    }
  }

  protected guardar(): void {
    if(!this.formData.invalid){

    }else{

    }
    console.table(this.formData.value);
    this.formData.reset();
  }
}
