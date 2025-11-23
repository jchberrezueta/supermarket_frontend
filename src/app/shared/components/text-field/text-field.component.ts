import { Component, input, output } from '@angular/core';
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
  public label = input.required<string>();
  protected placeholder = input<string>('...');
  public onChange = output<string>();


  constructor() {
    console.log('ui-text-field listo :)');
  }

  protected emitValue(event:any) {
    this.onChange.emit(event.target.value);
  }

  public get getLabel(): string {
    return this.label();
  }
  public get getPlaceholder(): string {
    return this.placeholder();
  }
}