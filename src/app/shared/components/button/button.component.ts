import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const IMPORTS = [MatButtonModule, MatIconModule, CommonModule];

const COLOR_MAP: Record<string, string> = {
  primary: 'var(--sm-color-primary)',
  blue: 'var(--sm-color-edit)',

  secondary: 'var(--sm-color-secondary)',
  success: 'var(--sm-color-success)',
  green: 'var(--sm-color-success)',

  danger: 'var(--sm-color-danger)',
  error: 'var(--sm-color-danger)',
  red: 'var(--sm-color-danger)',

  warning: 'var(--sm-color-warning)',
  yellow: 'var(--sm-color-warning)',

  info: 'var(--sm-color-edit)',
  purple: 'var(--sm-color-secondary)',

  accent: 'var(--sm-color-accent)',
  orange: 'var(--sm-color-accent)',

  neutral: 'var(--sm-color-text-muted)',
  gray: 'var(--sm-color-text-muted)',
};

const ACTION_COLOR_MAP: Record<string, string> = {
  add: 'var(--sm-color-success)',
  create: 'var(--sm-color-success)',
  save: 'var(--sm-color-success)',
  confirm: 'var(--sm-color-success)',
  update: 'var(--sm-color-edit)',
  edit: 'var(--sm-color-edit)',
  delete: 'var(--sm-color-danger)',
  remove: 'var(--sm-color-danger)',
  details: 'var(--sm-color-secondary)',
  view: 'var(--sm-color-secondary)',
  filter: 'var(--sm-color-filter)',
  search: 'var(--sm-color-filter)',
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
  public disabled = input<boolean>(false);
  public tooltip = input<string>();
  public ariaLabel = input<string>();

  public evntClick = output<string>();

  protected emitClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled()) {
      return;
    }
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

  public get accessibleLabel(): string {
    return (
      this.ariaLabel() ||
      this.tooltip() ||
      this.getLabel ||
      this.getIcon ||
      this.getAction
    );
  }

  private resolveColor(color: string | undefined): string {
    const actionColor = ACTION_COLOR_MAP[this.semanticAction];

    if (!color) {
      return actionColor || COLOR_MAP['primary'];
    }

    const normalized = color.trim().toLowerCase();

    if (actionColor && normalized === 'primary') {
      return actionColor;
    }

    if (COLOR_MAP[normalized]) {
      return COLOR_MAP[normalized];
    }

    if (this.isRawCssColor(color)) {
      return color;
    }

    return color;
  }

  private get semanticAction(): string {
    const action = this.getAction.trim().toLowerCase();

    if (ACTION_COLOR_MAP[action]) {
      return action;
    }

    const label = this.getLabel?.trim().toLowerCase() ?? '';
    const labelActions: Array<[string, string]> = [
      ['agregar', 'add'],
      ['crear', 'create'],
      ['guardar', 'save'],
      ['confirmar', 'confirm'],
      ['actualizar', 'update'],
      ['modificar', 'edit'],
      ['editar', 'edit'],
      ['eliminar', 'delete'],
      ['ver', 'view'],
      ['detalle', 'details'],
      ['filtrar', 'filter'],
      ['buscar', 'search'],
    ];

    const labelAction = labelActions.find(([prefix]) =>
      label.startsWith(prefix),
    )?.[1];

    if (labelAction) {
      return labelAction;
    }

    const icon = this.getIcon?.trim().toLowerCase() ?? '';

    return ACTION_COLOR_MAP[icon] ? icon : action;
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
