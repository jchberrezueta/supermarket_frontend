import { Component, EventEmitter, input, Input, Output, output } from '@angular/core';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
  
const IMPORTS = [
  MatFormFieldModule,
  MatSelectModule,
  CommonModule
];
interface SelectOption {
  label: string;
  value: any;
}
@Component({
  selector: 'ui-combo-box',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './combo-box.component.html',
  styleUrl: './combo-box.component.scss',
})
export class UiComboBoxComponent {
  public options = input.required<IComboBoxOption[]>();
  public title = input.required<string>();
  public evntSelectOption = output<number>();
  public value = '';
  public open = false;
  public selectedLabel: string | null = null;
  public selectedValue: any = null;

  constructor() {
    console.log('ui-combo-box listo :)');
  }

  protected toggle() {
    this.open = !this.open;
  }

  protected selectOption(opt: IComboBoxOption, event: MouseEvent) {
    event.stopPropagation(); // evita que toggle() se active en el click

    this.selectedLabel = opt.label;
    this.selectedValue = opt.value;
    this.open = false;

    this.evntSelectOption.emit(opt.value);
  }

  protected emitValue(option:any) {
    this.evntSelectOption.emit(option.value);
  }

  public get getTitulo(): string {
    return this.title();
  }
  public get getOptions(): IComboBoxOption[] {
    return this.options();
  }

}