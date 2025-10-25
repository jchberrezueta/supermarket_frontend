import { Component, Input } from '@angular/core';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButton],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() colorPrimary = 'green';
  @Input() colorSecondary = 'blue';
  @Input() textColor = 'white';
  @Input() fontSize = '16px';
  @Input() texto = 'Vamos :)';

  constructor() {

  }


}