import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideDirective } from '@shared/directives/clicOutsideDirective.directive';
import { IComboBoxOption } from '@shared/models/combo_box_option';

const IMPORTS = [
  MatFormFieldModule,
  MatSelectModule,
  CommonModule,
  ClickOutsideDirective,
];

const PROVIDERS = [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiComboBoxComponent),
    multi: true,
  },
];

@Component({
  selector: 'ui-combo-box',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './combo-box.component.html',
  styleUrl: './combo-box.component.scss',
})
export class UiComboBoxComponent implements ControlValueAccessor {
  public options = input.required<IComboBoxOption[]>();
  public label = input.required<string>();
  public width = input<string>('');
  public disabled = input<boolean>(false);
  public returnValue = input<string>('');
  public evntSelectOption = output<any>();

  public open = false;
  public isDisabled = false;
  public selectedLabel: string | null = null;
  public selectedValue: any = null;

  public onChange = (_value: any) => {};
  public onTouched = () => {};

  constructor() {
    effect(() => {
      this.options();
      this.syncSelection();
    });

    effect(
      () => {
        this.isDisabled = this.disabled();
      },
      { allowSignalWrites: true },
    );
  }

  protected toggle(): void {
    if (this.isDisabled) {
      return;
    }

    this.open = !this.open;
  }

  protected emitValue(opt: IComboBoxOption, event: MouseEvent): void {
    event.stopPropagation();

    if (this.isDisabled) {
      return;
    }

    this.selectedLabel = opt.label;
    this.selectedValue = opt.value;
    this.open = false;
    this.evntSelectOption.emit(opt.value);

    if (this.returnValue() === '' || this.returnValue() === 'value') {
      this.onChange(opt.value);
    } else if (this.returnValue() === 'label') {
      this.onChange(opt.label);
    }

    this.onTouched();
  }

  public get getLabel(): string {
    return this.label();
  }

  public get getOptions(): IComboBoxOption[] {
    return this.options() ?? [];
  }

  public get hasSelected(): boolean {
    return this.selectedLabel !== null && this.selectedLabel !== undefined;
  }

  public get controlWidth(): string | null {
    return this.resolveWidth(this.width());
  }

  public writeValue(value: any): void {
    if (value === -1 || value === '') {
      this.selectedValue = null;
      this.selectedLabel = null;
      return;
    }

    this.selectedValue = value;
    this.syncSelection();
  }

  public syncSelection(): void {
    const options = this.options?.();

    if (!options || !options.length) {
      return;
    }

    if (this.selectedValue === null || this.selectedValue === undefined) {
      return;
    }

    const labelFound = options.find(
      (option) => option.value == this.selectedValue,
    )?.label;

    if (labelFound) {
      this.selectedLabel = labelFound;
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
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
