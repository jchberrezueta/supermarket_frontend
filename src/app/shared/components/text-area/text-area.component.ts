import { Component, input } from '@angular/core';
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
  styleUrl: './text-area.component.scss'
})
export class UiTextAreaComponent {
  public placeholder = input<string>('...');
}
