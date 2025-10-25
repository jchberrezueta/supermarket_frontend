import { Component } from '@angular/core';
import { FormBuilder , FormGroup , Validators , ReactiveFormsModule } from  '@angular/forms' ; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export  default class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  contador = 0;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.loginForm = this.fb.group({
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
      this.authService.login(credencial).subscribe({
        next: (response) => {
          const { access_token, user } = response;
          this.authService.saveSession(access_token, user);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.errorMessage = 'Credenciales inválidas';
        }
      });
    } else {
      this.contador++;
      this.loginForm.markAllAsTouched();
    }
  }
}
