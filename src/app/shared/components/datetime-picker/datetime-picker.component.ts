import { Component, input, output } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule, 
  MatDatepickerModule
];

const PROVIDERS = [
  provideNativeDateAdapter()
];

@Component({
  selector: 'ui-datetime-picker',
  standalone: true,
  imports: IMPORTS,
  providers: PROVIDERS,
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss'
})
export class UiDatetimePickerComponent {
  public label = input<string>('Fecha');
  public evntDateChange = output<Date>();

  protected emitValue(event:any){
    this.evntDateChange.emit(event.value);
  }
  public get getLabel(): string {
    return this.label();
  }
}
