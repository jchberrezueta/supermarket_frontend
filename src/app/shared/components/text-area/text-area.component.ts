import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule
];

@Component({
  selector: 'ui-text-area',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UiTextAreaComponent),
        multi: true
      }
    ]
})
export class UiTextAreaComponent implements ControlValueAccessor {

  public label = input.required<string>();
  public placeholder = input<string>('...');
  public evntChange = output<string>();

  public onChange = (value: any) => {};
  public onTouched = () => {};
  public value: string = '';
  public disabled = false;

  constructor() {
    console.log('ui-text-area listo :)');
  }

  protected emitValue(event:any) {
    this.evntChange.emit(event.target.value);
  }
  // Método llamado por el formulario cuando cambia el valor
  public writeValue(value: any): void {
    this.value = value;
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
    this.onChange(this.value);   // notifica al formulario
  }


  protected get getLabel(): string {
    return this.label();
  }
  protected get getPlaceholder(): string {
    return this.placeholder();
  }
}
