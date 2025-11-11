import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const IMPORTS = [
  MatFormFieldModule, 
  MatInputModule
];


@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class UiTextFieldComponent {
  public placeholder = input<string>('...');
  
}
