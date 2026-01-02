import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder , FormGroup , Validators , ReactiveFormsModule } from  '@angular/forms'; 
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  protected loginForm!: FormGroup;
  protected contador = 0;
  protected errorMessage: string = '';
  
  constructor() {
    this.configForm();
  }

  configForm() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      const credencial = {
        usuario: credentials.usuario,
        clave: credentials.clave,
        numIntentos: this.contador
      }
      this._authService.login(credencial).subscribe({
              next: (response) => {
                const { access_token, user } = response;
                this._authService.saveSession(access_token, user);
                this._router.navigate(['/admin']);
              },
              error: (err) => {
                this.contador++;
                console.error('Error de login:', err);
                this.errorMessage = 'Credenciales inválidas';
              }
            });;;
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
