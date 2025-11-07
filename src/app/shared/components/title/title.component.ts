import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class UiTitleComponent {
  public title = input.required<string>();

  public get titulo(): string {
    return this.title();
  }
}
