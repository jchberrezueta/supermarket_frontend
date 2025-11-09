import { Component, input, Input } from '@angular/core';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
  
const IMPORTS = [
  MatFormFieldModule,
  MatSelectModule,
];

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
  public value = '';

  public get titulo(): string {
    return this.title();
  }
}




 
