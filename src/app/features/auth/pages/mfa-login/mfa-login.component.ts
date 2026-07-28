import { CommonModule } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-mfa-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './mfa-login.component.html',
  styleUrl: './mfa-login.component.scss',
})
export default class MfaLoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected isSubmitting = false;

  protected errorMessage = '';

  constructor() {
    if (!this.authService.getPendingMfaToken()) {
      void this.router.navigate(['/auth/login'], {
        replaceUrl: true,
      });
    }
  }

  protected submit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.errorMessage = 'Ingresa el código de 6 dígitos.';

      return;
    }

    const mfaToken = this.authService.getPendingMfaToken();

    if (!mfaToken) {
      this.errorMessage = 'El desafío MFA expiró. Inicia sesión nuevamente.';

      return;
    }

    this.isSubmitting = true;

    this.authService
      .verificarMfaLogin({
        mfaToken,
        codigo: this.form.controls.codigo.value ?? '',
      })
      .subscribe({
        next: (response) => {
          this.authService.saveSession(response);

          void this.router.navigate(['/admin'], {
            replaceUrl: true,
          });
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.form.controls.codigo.setValue('');

          const message = error.error?.message;

          this.errorMessage =
            typeof message === 'string'
              ? message
              : 'El código no es válido o expiró.';
        },
      });
  }

  protected cancel(): void {
    this.authService.clearPendingMfaToken();

    void this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }

  protected onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;

    const normalized = input.value.replace(/\D/g, '').slice(0, 6);

    input.value = normalized;

    this.form.controls.codigo.setValue(normalized, {
      emitEvent: false,
    });
  }
}
