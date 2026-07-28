import { CommonModule } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { IMfaSetupResponse } from '@core/models';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-account-security',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, MatIconModule],

  templateUrl: './account-security.component.html',

  styleUrl: './account-security.component.scss',
})
export default class AccountSecurityComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  protected isLoading = true;

  protected isSubmitting = false;

  protected mfaEnabled = false;

  protected setup: IMfaSetupResponse | null = null;

  protected errorMessage = '';

  protected successMessage = '';

  protected readonly generateForm = this.formBuilder.group({
    claveActual: ['', [Validators.required]],
  });

  protected readonly activationForm = this.formBuilder.group({
    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected readonly disableForm = this.formBuilder.group({
    claveActual: ['', [Validators.required]],

    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.loadStatus();
  }

  protected generateConfiguration(): void {
    this.clearMessages();

    if (this.generateForm.invalid) {
      this.generateForm.markAllAsTouched();

      this.errorMessage = 'Ingresa tu contraseña actual.';

      return;
    }

    this.isSubmitting = true;

    this.authService
      .generarMfa(this.generateForm.controls.claveActual.value ?? '')
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;

          this.setup = response;

          this.generateForm.reset();

          this.successMessage = response.message;
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.errorMessage = this.extractError(error);
        },
      });
  }

  protected activateMfa(): void {
    this.clearMessages();

    if (this.activationForm.invalid) {
      this.activationForm.markAllAsTouched();

      this.errorMessage = 'Ingresa el código de seis dígitos.';

      return;
    }

    this.isSubmitting = true;

    this.authService
      .activarMfa(this.activationForm.controls.codigo.value ?? '')
      .subscribe({
        next: (response) => {
          this.successMessage = this.normalizeMessage(
            response.message,
            'MFA activado correctamente.',
          );

          this.finishSecurityChange();
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.activationForm.reset();

          this.errorMessage = this.extractError(error);
        },
      });
  }

  protected disableMfa(): void {
    this.clearMessages();

    if (this.disableForm.invalid) {
      this.disableForm.markAllAsTouched();

      this.errorMessage = 'Ingresa tu contraseña y el código MFA.';

      return;
    }

    this.isSubmitting = true;

    const value = this.disableForm.getRawValue();

    this.authService
      .desactivarMfa(value.claveActual ?? '', value.codigo ?? '')
      .subscribe({
        next: (response) => {
          this.successMessage = this.normalizeMessage(
            response.message,
            'MFA desactivado correctamente.',
          );

          this.finishSecurityChange();
        },

        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          this.disableForm.controls.codigo.setValue('');

          this.errorMessage = this.extractError(error);
        },
      });
  }

  protected normalizeCode(
    event: Event,
    control: 'activation' | 'disable',
  ): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '').slice(0, 6);

    input.value = value;

    if (control === 'activation') {
      this.activationForm.controls.codigo.setValue(value, {
        emitEvent: false,
      });

      return;
    }

    this.disableForm.controls.codigo.setValue(value, {
      emitEvent: false,
    });
  }

  protected cancelSetup(): void {
    this.setup = null;
    this.activationForm.reset();
    this.clearMessages();
  }

  private loadStatus(): void {
    this.authService.obtenerEstadoMfa().subscribe({
      next: (response) => {
        this.mfaEnabled = response.habilitado;

        this.isLoading = false;
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.errorMessage = this.extractError(error);
      },
    });
  }

  private finishSecurityChange(): void {
    /*
     * El backend revoca todas las
     * sesiones después de activar
     * o desactivar MFA.
     */
    window.setTimeout(() => {
      this.authService.clearSession();

      void this.router.navigate(['/auth/login'], {
        replaceUrl: true,
      });
    }, 1400);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private normalizeMessage(
    message: string | string[] | undefined,
    fallback: string,
  ): string {
    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return fallback;
  }

  private extractError(error: HttpErrorResponse): string {
    const message = error.error?.message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'No fue posible completar la operación.';
  }
}
