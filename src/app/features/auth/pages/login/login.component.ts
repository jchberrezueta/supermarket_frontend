import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  protected loginForm!: FormGroup;
  protected contador = 0;
  protected errorMessage = '';
  protected isSubmitting = false;
  protected showPassword = false;

  constructor() {
    this.configForm();
  }

  private configForm(): void {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required]],
    });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  protected onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Ingresa usuario y contraseña para continuar.';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const credentials = this.loginForm.getRawValue();

    const credencial = {
      usuario: credentials.usuario,
      clave: credentials.clave,
      numIntentos: this.contador,
    };

    this._authService.login(credencial).subscribe({
      next: (response) => {
        const { access_token, user } = response;
        this._authService.saveSession(access_token, user);
        this._router.navigate(['/admin']);
      },
      error: () => {
        this.contador++;
        this.isSubmitting = false;
        this.errorMessage =
          'Credenciales inválidas. Verifica tu usuario y contraseña.';
      },
    });
  }
}
