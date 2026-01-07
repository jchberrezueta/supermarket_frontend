import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

const IMPORTS = [
  MatButtonModule, 
  MatIconModule, 
  CommonModule
];

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class UiButtonComponent {

  public label = input<string>();
  public action = input<string>('crud');
  public icon = input<string>();
  public color = input<string>('primary');
  public textColor = input<string>('white');
  public width = input<string>('auto');

  public evntClick = output<string>();

  constructor() {
    effect(() => {
      this.color();
    })
  }

  protected emitClick(event:any){
    this.evntClick.emit(this.getAction);
  }

  public get getLabel() {
    return this.label();
  }
  public get getAction() {
    return this.action();
  }
  public get getIcon() {
    return this.icon();
  }
  public get getColor() {
    return this.color();
  }
  public get getWidth() {
    return this.width();
  }
  public get getTextColor() {
    return this.textColor();
  }
}