import { Component, forwardRef, input, output, signal, effect, ɵINPUT_SIGNAL_BRAND_WRITE_TYPE, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule
];

const PROVIDERS =[
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiTextFieldComponent),
    multi: true
  }
];

@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class UiTextFieldComponent implements ControlValueAccessor {
  public label = input.required<string>();
  public value = input<any>('');
  public valueType = input<'string' | 'number'>('string');
  public disabled = input<boolean>(false);
  protected _isDisabled = signal(false);
  protected innerValue = signal<string>('');
  public placeholder = input<string>('...');
  public evntChange = output<string>();
  public onChange = (value: any) => {};
  public onTouched = () => {};
  

  constructor() {
    effect(() => {
      if (this.value() !== undefined && this.value() !== '') {
        this.innerValue.set(this.value());
      }
    },
    { allowSignalWrites: true });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this._isDisabled.set(this.disabled());
    }
  }

  protected emitValue(event:any) {
    this.evntChange.emit(event.target.value);
  }

  get getLabel(): string {
    return this.label();
  }
  get getPlaceholder(): string {
    return this.placeholder();
  }

  /* 
    ControlValueAccesor
  */

  // Método llamado por el formulario cuando cambia el valor
  public writeValue(value: any): void {
    this.innerValue.set(value ?? '');
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
  public updateValue(event: Event) {
    const rawValue = (event.target as HTMLInputElement).value;
    let parsedValue: any = rawValue;

    if (this.valueType() === 'number') {
      parsedValue = rawValue === '' ? null : Number(rawValue);
    }
    this.innerValue.set(parsedValue);
    this.onChange(parsedValue);
  }
}