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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

const IMPORTS = [
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  CommonModule,
];

const PROVIDERS = [
  provideNativeDateAdapter(),
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiDatetimePickerComponent),
    multi: true,
  },
];

@Component({
  selector: 'ui-datetime-picker',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
})
export class UiDatetimePickerComponent implements ControlValueAccessor {
  public label = input.required<string>();
  public value = input<string>('');
  public disabled = input<boolean>(false);
  public width = input<string>('auto');
  public isTime = input<boolean>(false);
  public showHint = input<boolean>(false);
  public evntDateChange = output<any>();

  protected innerValue = signal<string>('');
  protected _isDisabled = signal(false);

  public onChange = (_value: any) => {};
  public onTouched = () => {};

  constructor() {
    effect(
      () => {
        const externalValue = this.value();

        if (externalValue !== undefined && externalValue !== '') {
          this.writeValue(externalValue);
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
    const value = (event.target as HTMLInputElement).value;
    this.evntDateChange.emit(value);
  }

  public get getLabel(): string {
    return this.label();
  }

  public get getShowHint(): boolean {
    return this.showHint();
  }

  public get hasValue(): boolean {
    const value = this.innerValue();

    return value !== null && value !== undefined && value !== '';
  }

  public get controlWidth(): string | null {
    return this.resolveWidth(this.width());
  }

  public writeValue(value: string | null): void {
    if (!value) {
      this.innerValue.set('');
      return;
    }

    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(value)) {
      this.innerValue.set(value);
      return;
    }

    let fecha = new Date(value);

    if (Number.isNaN(fecha.getTime())) {
      this.innerValue.set('');
      return;
    }

    fecha = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);

    const formatted = fecha.toISOString().slice(0, this.isTime() ? 16 : 10);
    this.innerValue.set(formatted);
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
    const value = (event.target as HTMLInputElement).value;

    this.innerValue.set(value);
    this.onChange(value);
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
