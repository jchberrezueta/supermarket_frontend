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

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required]],
    });
  }

  onSubmit() {


    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Login con:', credentials);
      this.router.navigate(['/admin']);
      /*this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log(response);
          const { access_token, user } = response;
          this.authService.saveSession(access_token, user);
          this.router.navigate(['/admin']); // o la ruta que desees al iniciar sesión
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.errorMessage = 'Credenciales inválidas'; // puedes mostrarlo en el template
        }
      });*/
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
