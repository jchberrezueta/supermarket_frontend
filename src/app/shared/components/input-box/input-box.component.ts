import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '@shared/directives/clicOutsideDirective.directive';
  
const IMPORTS = [
  MatFormFieldModule,
  MatSelectModule,
  CommonModule,
  ClickOutsideDirective
];

const PROVIDERS = [
  {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputBoxComponent),
      multi: true
    }
];

@Component({
  selector: 'ui-input-box',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './input-box.component.html',
  styleUrl: './input-box.component.scss'
})
export class UiInputBoxComponent implements ControlValueAccessor {
  public options = input.required<IComboBoxOption[]>();
  public label = input.required<string>();
  public placeholder = input<string>('...');
  public evntSelectOption = output<number>();
  protected optionsFiltered = signal('');
  public open: boolean = false;
  public disabled: boolean = false;
  public selectedLabel: string | null = null;
  public selectedValue: any = null;
  public onChange = (value: any) => {};
  public onTouched = () => {};

  protected toggle() {
    this.open = !this.open;
  }

  protected filteredItems = computed(() => {
    const term = this.getOptionsFiltered.toLowerCase();

    return this.getOptions.filter(op =>
      op.label.toLowerCase().includes(term)
    ) ?? [];
  });

  protected emitValue(opt: IComboBoxOption, event: MouseEvent) {
    event.stopPropagation(); // evita que toggle() se active en el click

    this.selectedLabel = opt.label;
    this.selectedValue = opt.value;
    this.open = false;
    this.evntSelectOption.emit(opt.value);
    this.onChange(opt.value);
    this.onTouched();
  }
//
  get getPlaceholder(): string {
    return this.placeholder();
  }
  get getLabel(): string {
    return this.label();
  }
  get getOptions(): IComboBoxOption[] {
    return this.options();
  }
  get getOptionsFiltered(): string {
    return this.optionsFiltered();
  }

  // Método obligatorio: escribir el valor desde el form
  writeValue(value: any): void {
    if(value){
      this.selectedValue = value;
      this.selectedLabel = this.getOptions.find((obj) => value === obj.value)?.label || null;
    }
  }

  // Registrar función que notifica cambios al formulario
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registrar función para marcar "touched"
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Setear si está deshabilitado
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}