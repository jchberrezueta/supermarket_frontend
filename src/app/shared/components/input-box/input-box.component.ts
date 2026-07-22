import {
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
    useExisting: forwardRef(() => UiInputBoxComponent),
    multi: true,
  },
];

@Component({
  selector: 'ui-input-box',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './input-box.component.html',
  styleUrl: './input-box.component.scss',
})
export class UiInputBoxComponent implements ControlValueAccessor {
  public options = input.required<IComboBoxOption[]>();
  public label = input.required<string>();
  public placeholder = input<string>('...');
  public width = input<string>('');
  public returnValue = input<string>('value');
  public disabled = input<boolean>(false);
  public evntSelectOption = output<any>();

  protected optionsFiltered = signal('');
  protected isDisabled = signal(false);

  public open = false;
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
        this.isDisabled.set(this.disabled());
      },
      { allowSignalWrites: true },
    );
  }

  protected toggle(): void {
    if (this.isDisabled()) {
      return;
    }

    this.open = true;
  }

  protected filteredItems = computed(() => {
    const term = this.getOptionsFiltered.toLowerCase().trim();

    return (
      this.getOptions.filter((option) =>
        option.label.toLowerCase().includes(term),
      ) ?? []
    );
  });

  protected emitValue(opt: IComboBoxOption, event: MouseEvent): void {
    event.stopPropagation();

    if (this.isDisabled()) {
      return;
    }

    this.selectedLabel = opt.label;
    this.selectedValue = opt.value;
    this.optionsFiltered.set('');
    this.open = false;
    this.evntSelectOption.emit(opt.value);

    if (this.returnValue() === '' || this.returnValue() === 'value') {
      this.onChange(opt.value);
    } else if (this.returnValue() === 'label') {
      this.onChange(opt.label);
    }

    this.onTouched();
  }

  public get getPlaceholder(): string {
    return this.placeholder();
  }

  public get getLabel(): string {
    return this.label();
  }

  public get getOptions(): IComboBoxOption[] {
    return this.options() ?? [];
  }

  public get getOptionsFiltered(): string {
    return this.optionsFiltered();
  }

  public get hasSelected(): boolean {
    return this.selectedLabel !== null && this.selectedLabel !== undefined;
  }

  public get controlWidth(): string | null {
    return this.resolveWidth(this.width());
  }

  public writeValue(value: any): void {
    if (value === -1 || value === '' || value === null || value === undefined) {
      this.selectedValue = null;
      this.selectedLabel = null;
      this.optionsFiltered.set('');
      return;
    }

    this.selectedValue = value;
    this.syncSelection();
  }

  public syncSelection(): void {
    const options = this.options?.();

    if (!options || !options.length) {
      this.selectedLabel = null;
      return;
    }

    if (this.selectedValue === null || this.selectedValue === undefined) {
      return;
    }

    const selectedOption = options.find((option) =>
      this.returnValue() === 'label'
        ? option.label === this.selectedValue
        : option.value == this.selectedValue,
    );

    this.selectedLabel = selectedOption?.label ?? null;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
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
