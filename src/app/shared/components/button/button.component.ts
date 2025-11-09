import { Component, input } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class UiButtonComponent {
  public label = input<string>();
  public action = input<string>('crud');
  public icon = input<string>();
  public color = input<string>('primary');
  public width = input<string>();
  constructor() {

  }


}