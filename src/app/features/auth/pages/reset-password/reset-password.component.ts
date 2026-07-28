import { CommonModule } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-reset-password',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, MatIconModule],

  templateUrl: './reset-password.component.html',

  styleUrl: '../change-password/change-password.component.scss',
})
export default class ResetPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly token =
    this.activatedRoute.snapshot.queryParamMap.get('token')?.trim() ?? '';

  protected readonly form = this.formBuilder.group({
    nuevaClave: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    ],

    confirmarClave: ['', [Validators.required]],
  });

  protected showPassword = false;

  protected showConfirmation = false;

  protected isSubmitting = false;

  protected errorMessage = '';

  protected successMessage = '';

  constructor() {
    if (!this.token) {
      this.errorMessage =
        'El enlace de recuperación no contiene un token válido.';

      this.form.disable();
    }
  }

  protected submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'El enlace de recuperación no es válido.';

      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.errorMessage = 'Completa correctamente los campos.';

      return;
    }

    const { nuevaClave, confirmarClave } = this.form.getRawValue();

    if (nuevaClave !== confirmarClave) {
      this.errorMessage = 'Las contraseñas no coinciden.';

      return;
    }

    if (!this.meetsPasswordPolicy(nuevaClave ?? '')) {
      this.errorMessage =
        'La contraseña debe incluir mayúscula, minúscula, número y carácter especial.';

      return;
    }

    this.isSubmitting = true;

    this.authService
      .restablecerPassword(this.token, nuevaClave ?? '')
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.successMessage = 'La contraseña fue restablecida correctamente.';

          this.form.disable();

          window.setTimeout(() => {
            void this.router.navigate(['/auth/login'], {
              replaceUrl: true,
            });
          }, 1400);
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.errorMessage = this.extractError(error);
        },
      });
  }

  protected volverLogin(): void {
    void this.router.navigate(['/auth/login']);
  }

  private meetsPasswordPolicy(value: string): boolean {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /\d/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    );
  }

  private extractError(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'El enlace es inválido, expiró o ya fue utilizado.';
  }
}
