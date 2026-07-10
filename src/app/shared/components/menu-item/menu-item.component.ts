import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IOpcionSidebar } from '@core/models/opcion_sidebar.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const IMPORTS = [MatExpansionModule, MatIconModule, MatListModule];

@Component({
  selector: 'ui-menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: IMPORTS,
})
export class UiMenuItemComponent {
  private readonly _router = inject(Router);

  public item = input.required<IOpcionSidebar>();

  get elem(): IOpcionSidebar {
    return this.item();
  }

  protected navigateToUrl(url: string): void {
    const normalizedUrl = this.normalizeUrl(url);

    this._router.navigate([normalizedUrl]);
  }

  protected hasChildren(item: IOpcionSidebar): boolean {
    return Array.isArray(item.hijas) && item.hijas.length > 0;
  }

  protected hasActiveChild(item: IOpcionSidebar): boolean {
    if (this.isActiveUrl(item.ruta)) {
      return true;
    }

    if (!this.hasChildren(item)) {
      return false;
    }

    return item.hijas.some((child) => this.hasActiveChild(child));
  }

  protected isActiveUrl(url: string): boolean {
    const normalizedUrl = this.normalizeUrl(url);
    const currentUrl = this._router.url.split('?')[0];

    return (
      currentUrl === normalizedUrl || currentUrl.startsWith(`${normalizedUrl}/`)
    );
  }

  private normalizeUrl(url: string): string {
    if (!url) {
      return '/admin';
    }

    return url.startsWith('/') ? url : `/${url}`;
  }
}
