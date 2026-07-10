import {
  Component,
  SimpleChanges,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const IMPORTS = [MatFormFieldModule, MatInputModule, CommonModule];

const PROVIDERS = [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiTextFieldComponent),
    multi: true,
  },
];

type UiTextFieldType = 'string' | 'number' | 'password';

@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class UiTextFieldComponent implements ControlValueAccessor {
  public label = input.required<string>();
  public value = input<any>('');
  public valueType = input<UiTextFieldType>('string');
  public disabled = input<boolean>(false);
  public width = input<string>('auto');
  public placeholder = input<string>('...');
  public evntChange = output<any>();

  protected innerValue = signal<any>('');
  protected _isDisabled = signal(false);

  public onChange = (_value: any) => {};
  public onTouched = () => {};

  constructor() {
    effect(
      () => {
        const externalValue = this.value();

        if (externalValue !== undefined) {
          this.innerValue.set(externalValue ?? '');
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        this._isDisabled.set(this.disabled());
      },
      { allowSignalWrites: true },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this._isDisabled.set(this.disabled());
    }
  }

  protected emitValue(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    this.evntChange.emit(this.parseValue(rawValue));
  }

  public get getLabel(): string {
    return this.label();
  }

  public get getPlaceholder(): string {
    return this.placeholder();
  }

  public get inputType(): string {
    if (this.valueType() === 'password') {
      return 'password';
    }

    if (this.valueType() === 'number') {
      return 'number';
    }

    return 'text';
  }

  public get hasValue(): boolean {
    const value = this.innerValue();

    return value !== null && value !== undefined && value !== '';
  }

  public get controlWidth(): string | null {
    return this.resolveWidth(this.width());
  }

  public writeValue(value: any): void {
    this.innerValue.set(value ?? '');
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  public updateValue(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    const parsedValue = this.parseValue(rawValue);

    this.innerValue.set(parsedValue);
    this.onChange(parsedValue);
  }

  private parseValue(rawValue: string): any {
    if (this.valueType() !== 'number') {
      return rawValue;
    }

    return rawValue === '' ? null : Number(rawValue);
  }

  private resolveWidth(width: string): string | null {
    if (!width || width === 'auto') {
      return null;
    }

    const normalized = width.trim().toLowerCase();

    if (
      normalized.endsWith('px') ||
      normalized.endsWith('%') ||
      normalized.endsWith('rem') ||
      normalized.endsWith('em') ||
      normalized.endsWith('vw') ||
      normalized.endsWith('vh') ||
      normalized.startsWith('var(') ||
      normalized.startsWith('calc(')
    ) {
      return width;
    }

    return `${width}px`;
  }
}
