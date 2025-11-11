import { Component, input } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule, 
  MatDatepickerModule
];

@Component({
  selector: 'ui-datetime-picker',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss'
})
export class UiDatetimePickerComponent {
  public label = input.required<string>();
}
