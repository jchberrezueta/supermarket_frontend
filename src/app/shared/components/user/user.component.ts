import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { ClickOutsideDirective } from '@shared/directives/clicOutsideDirective.directive';

@Component({
  selector: 'ui-user',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UiUserComponent {
  private readonly _authService = inject(AuthService);
  protected genero: string = 'femenino';
  protected open: boolean = false;
   
  constructor() {}

  protected toggle() {
    this.open = !this.open;
  }

  protected miProfile() {

  }

  protected logout() {
    this._authService.logout();
  }
}