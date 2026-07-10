import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const IMPORTS = [MatButtonModule, MatIconModule, CommonModule];

const COLOR_MAP: Record<string, string> = {
  primary: 'var(--sm-color-primary)',
  blue: 'var(--sm-color-primary)',

  secondary: 'var(--sm-color-secondary)',
  success: 'var(--sm-color-success)',
  green: 'var(--sm-color-success)',

  danger: 'var(--sm-color-danger)',
  error: 'var(--sm-color-danger)',
  red: 'var(--sm-color-danger)',

  warning: 'var(--sm-color-warning)',
  yellow: 'var(--sm-color-warning)',

  info: 'var(--sm-color-info)',
  purple: '#7c3aed',

  accent: 'var(--sm-color-accent)',
  orange: 'var(--sm-color-accent)',

  neutral: 'var(--sm-color-text-muted)',
  gray: 'var(--sm-color-text-muted)',
};

const TEXT_COLOR_MAP: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  text: 'var(--sm-color-text)',
  muted: 'var(--sm-color-text-muted)',
};

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

  protected emitClick(event: MouseEvent): void {
    event.stopPropagation();
    this.evntClick.emit(this.getAction);
  }

  public get getLabel(): string | undefined {
    return this.label();
  }

  public get getAction(): string {
    return this.action();
  }

  public get getIcon(): string | undefined {
    return this.icon();
  }

  public get buttonBackground(): string {
    return this.resolveColor(this.color());
  }

  public get buttonTextColor(): string {
    return this.resolveTextColor(this.textColor());
  }

  public get buttonWidth(): string {
    const width = this.width();

    if (!width || width === 'auto') {
      return 'auto';
    }

    if (this.isCssSize(width)) {
      return width;
    }

    return `${width}px`;
  }

  private resolveColor(color: string | undefined): string {
    if (!color) {
      return COLOR_MAP['primary'];
    }

    const normalized = color.trim().toLowerCase();

    if (COLOR_MAP[normalized]) {
      return COLOR_MAP[normalized];
    }

    if (this.isRawCssColor(color)) {
      return color;
    }

    return color;
  }

  private resolveTextColor(color: string | undefined): string {
    if (!color) {
      return TEXT_COLOR_MAP['white'];
    }

    const normalized = color.trim().toLowerCase();

    if (TEXT_COLOR_MAP[normalized]) {
      return TEXT_COLOR_MAP[normalized];
    }

    if (this.isRawCssColor(color)) {
      return color;
    }

    return color;
  }

  private isRawCssColor(value: string): boolean {
    const trimmed = value.trim().toLowerCase();

    return (
      trimmed.startsWith('#') ||
      trimmed.startsWith('rgb') ||
      trimmed.startsWith('hsl') ||
      trimmed.startsWith('var(') ||
      trimmed.startsWith('linear-gradient')
    );
  }

  private isCssSize(value: string): boolean {
    const trimmed = value.trim().toLowerCase();

    return (
      trimmed === 'auto' ||
      trimmed.endsWith('px') ||
      trimmed.endsWith('%') ||
      trimmed.endsWith('rem') ||
      trimmed.endsWith('em') ||
      trimmed.endsWith('vw') ||
      trimmed.endsWith('vh') ||
      trimmed.startsWith('var(') ||
      trimmed.startsWith('calc(')
    );
  }
}
