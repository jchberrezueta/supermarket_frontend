import { Component, effect, forwardRef, input, output, signal, SimpleChanges } from '@angular/core';
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
  public value = input<string>('');
  public disabled = input<boolean>(false);
  public isTime = input<boolean>(false);
  public showHint = input<boolean>(false);
  public evntDateChange = output<Date>();
  public onChange = (value: any) => {};
  public onTouched = () => {};
  protected innerValue = signal<string>('');
  protected _isDisabled = signal(false);

  constructor() {
    effect(() => {
      if (this.value() !== undefined && this.value() !== '') {
        this.writeValue(this.value());
      }
    },
    { allowSignalWrites: true });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this._isDisabled.set(this.disabled());
    }
  }

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
      this.innerValue.set('');
      return;
    }
    // Convertir a Date
    let fecha = new Date(value);
    // Validar fecha
    if (isNaN(fecha.getTime())) {
      console.warn("Fecha inválida recibida:", value);
      this.innerValue.set('');
      return;
    }
    // Ajuste de timezone para datetime-local
    fecha = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    const formatted = fecha.toISOString().slice(0, 16);
    this.innerValue.set(formatted);
    this.onChange(value);  
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
    this._isDisabled.set(isDisabled);
  }

  // Se ejecuta cuando el usuario escribe
  public updateValue(event: any) {
    this.innerValue.set(event.target.value);
    this.onChange(event.target.value);   // notifica al formulario
  }
}