import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { ClickOutsideDirective } from '@shared/directives/clicOutsideDirective.directive';

@Component({
  selector: 'ui-user',
  standalone: true,
  imports: [ClickOutsideDirective, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UiUserComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  protected open = false;

  protected toggle(): void {
    this.open = !this.open;
  }

  protected miProfile(): void {
    this.open = false;
    this._router.navigate(['/admin']);
  }

  protected logout(): void {
    this.open = false;
    this._authService.logout();
  }

  protected get userName(): string {
    const user = this._authService.getUser();

    return user?.username || 'Usuario';
  }

  protected get userRole(): string {
    const user = this._authService.getUser();

    return user?.perfil || 'perfil';
  }

  protected get userInitials(): string {
    const username = this.userName.trim();

    if (!username) {
      return 'U';
    }

    const parts = username.split(/\s+/).filter(Boolean).slice(0, 2);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return parts
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
