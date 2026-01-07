import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  private readonly _authService = inject(AuthService);
  protected readonly username: string = '';

  constructor() {
    this.username = this._authService.getUser()?.username ?? '';
  }

}
