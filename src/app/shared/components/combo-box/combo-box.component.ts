import { Component, Input } from '@angular/core';
import { IComboBoxOption } from '@shared/models/combo_box_option';

@Component({
  selector: 'app-combo-box',
  standalone: true,
  imports: [],
  templateUrl: './combo-box.component.html',
  styleUrl: './combo-box.component.scss'
})
export class ComboBoxComponent {
  @Input() options:IComboBoxOption[] = [];

}
