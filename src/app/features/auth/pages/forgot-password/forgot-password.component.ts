import { CommonModule } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, MatIconModule],

  templateUrl: './forgot-password.component.html',

  styleUrl: '../change-password/change-password.component.scss',
})
export default class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    usuario: ['', [Validators.required, Validators.maxLength(25)]],
  });

  protected isSubmitting = false;

  protected message = '';

  protected errorMessage = '';

  protected submit(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.errorMessage = 'Ingresa tu nombre de usuario.';

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const usuario = this.form.controls.usuario.value ?? '';

    this.authService.solicitarRecuperacion(usuario).subscribe({
      next: () => {
        this.isSubmitting = false;

        /*
         * El mensaje siempre es genérico
         * para no confirmar si la cuenta existe.
         */
        this.message =
          'Si la cuenta existe y tiene un correo asociado, recibirás un enlace de recuperación.';

        this.form.disable();
      },

      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        const message = error.error?.message;

        this.errorMessage =
          typeof message === 'string'
            ? message
            : 'No fue posible procesar la solicitud.';
      },
    });
  }

  protected volverLogin(): void {
    void this.router.navigate(['/auth/login']);
  }
}
