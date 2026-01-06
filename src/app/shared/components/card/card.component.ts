import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class UiCardComponent {
  // signals internos
  protected header = signal<boolean>(false);
  protected footer = signal<boolean>(false);

  constructor() {}

  /**
   * Muestra el header del card
   */
  @Input({ required: false })
  set showHeader(value: boolean) {
    this.header.set(value);
  }

  /**
   * Muestra el footer del card
   */
  @Input({ required: false })
  set showFooter(value: boolean) {
    this.footer.set(value);
  }
}