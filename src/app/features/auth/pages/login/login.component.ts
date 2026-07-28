import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';

import {
  isLoginSuccess,
  requiresMfa,
  requiresPasswordChange,
} from '@core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  private readonly formBuilder = inject(FormBuilder);

  protected loginForm: FormGroup;

  protected errorMessage = '';

  protected isSubmitting = false;

  protected showPassword = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(25)]],

      clave: ['', [Validators.required, Validators.maxLength(250)]],
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

    this.authService
      .login({
        usuario: String(credentials.usuario).trim().toLowerCase(),

        clave: String(credentials.clave),
      })
      .subscribe({
        next: (response) => {
          if (requiresPasswordChange(response)) {
            this.authService.savePendingPasswordChange(
              response.changeToken,
              response.usuario,
            );

            void this.router.navigate(['/auth/change-password'], {
              replaceUrl: true,
            });

            return;
          }

          if (requiresMfa(response)) {
            this.authService.savePendingMfaToken(response.mfaToken);

            void this.router.navigate(['/auth/mfa'], {
              replaceUrl: true,
            });

            return;
          }

          if (isLoginSuccess(response)) {
            this.authService.saveSession(response);

            void this.router.navigate(['/admin'], {
              replaceUrl: true,
            });
          }
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.errorMessage = this.getErrorMessage(error);
        },
      });
  }

  protected goToForgotPassword(): void {
    void this.router.navigate(['/auth/forgot-password']);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (typeof message === 'string') {
      if (message.toLowerCase().includes('bloqueada')) {
        return message;
      }

      if (message.toLowerCase().includes('inactiva')) {
        return (
          'La cuenta se encuentra inactiva. ' +
          'Comunícate con un administrador.'
        );
      }
    }

    return 'Credenciales inválidas. ' + 'Verifica tu usuario y contraseña.';
  }
}
