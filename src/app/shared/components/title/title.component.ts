import { Component, input } from '@angular/core';
import { UiButtonComponent } from "../button/button.component";

@Component({
  selector: 'ui-title',
  standalone: true,
  imports: [UiButtonComponent],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class UiTitleComponent {
  public title = input.required<string>();

  public get titulo(): string {
    return this.title();
  }
}
