import { Component, forwardRef, input, output } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule, 
  MatDatepickerModule
];

const PROVIDERS = [
  provideNativeDateAdapter(),
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiDatetimePickerComponent),
    multi: true
  }
];

@Component({
  selector: 'ui-datetime-picker',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss'
})
export class UiDatetimePickerComponent implements ControlValueAccessor {
  public label = input.required<string>();
  public showHint = input<boolean>(false);
  public evntDateChange = output<Date>();
  public onChange = (value: any) => {};
  public onTouched = () => {};
  public value: string | null  = '';
  public disabled = false;

  constructor() {}

  protected emitValue(event:any){
    this.evntDateChange.emit(event.target.value);
  }

  get getLabel(): string {
    return this.label();
  }
  get getShowHint(): boolean {
    return this.showHint();
  }

  // Método llamado por el formulario cuando cambia el valor
  public writeValue(value: string | null ): void {
    if (!value) {
      this.value = null;
      return;
    }
    // Convertir a Date
    let fecha = new Date(value);
    // Validar fecha
    if (isNaN(fecha.getTime())) {
      console.warn("Fecha inválida recibida:", value);
      this.value = null;
      return;
    }
    // Ajuste de timezone para datetime-local
    fecha = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    const formatted = fecha.toISOString().slice(0, 16);
    this.value = formatted;
  }


  // Angular llama a este método y tú guardas el callback
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Angular llama a este método para el “touched”
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Si el formulario deshabilita el control
  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // Se ejecuta cuando el usuario escribe
  public updateValue(event: any) {
    this.onChange(event.target.value);   // notifica al formulario
  }
}