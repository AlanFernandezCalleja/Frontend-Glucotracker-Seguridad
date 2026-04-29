import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// 🔹 1. Interfaz para las respuestas estandarizadas
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private fb = new FormBuilder();
  loading = signal(false);

  // Variables para los modales
  showVerificationModal = signal(false);
  showSuccessModal = signal(false);
  showErrorModal = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  forgotPassword() {
    console.log('Redirigir a recuperación de contraseña (pendiente)');
  }

  // Variable para guardar las credenciales temporalmente
  private loginCredentials: { id_usuario?: number, correo: string, contrasena: string } | null = null;

  constructor(private router: Router, private http: HttpClient) { }

  form = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    contrasena: ['', [Validators.required, Validators.minLength(3)]],
  });

  canSubmit() {
    return this.form.valid && !this.loading();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const credentials = {
      correo: this.form.value.usuario || '',
      contrasena: this.form.value.contrasena || ''
    };

    // Llamada al endpoint que envía OTP
    this.http.post<ApiResponse<any>>( // 🔹 2. Tipamos la respuesta
      environment.apiUrl + '/login',
      credentials,
      { withCredentials: true }
    )
      .subscribe({
        next: (res) => {
          console.log('Respuesta login:', res);
          this.loginCredentials = {
            correo: credentials.correo,
            contrasena: credentials.contrasena,
            // 🔹 3. Extraemos el ID desde res.data
            id_usuario: res.data.id_usuario
          };

          this.showVerificationModal.set(true);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error de login:', err);

          this.showErrorModal.set(true);
          // 🔹 4. Extraemos el mensaje de error estandarizado del backend
          this.errorMessage.set(err.error?.message || 'Error al conectar con el servidor');
          this.loading.set(false);
        }
      });
  }

  // Método para verificar el código y hacer el login real
  verifyAndLogin(codeInput: HTMLInputElement) {
    const codigo = codeInput.value.trim();

    if (!this.loginCredentials || !this.loginCredentials.id_usuario) {
      console.error('No hay credenciales guardadas');
      this.showErrorModal.set(true);
      this.errorMessage.set('Error interno: credenciales no encontradas');
      return;
    }

    if (!codigo || codigo.length !== 6) {
      this.showErrorModal.set(true);
      this.errorMessage.set('Ingresa un código válido de 6 dígitos');
      return;
    }

    this.loading.set(true);

    this.http.post<ApiResponse<any>>(environment.apiUrl + '/verify-otp', {
      id_usuario: this.loginCredentials.id_usuario,
      codigo
    }, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log('Login completado con OTP:', res);

        // 🔹 5. Ajuste flexible para leer los datos del usuario (asumiendo que verify-otp también está estandarizado)
        // Si tu backend manda res.data.usuario, usa ese, si manda las propiedades directo en res.data, usa res.data
        const usuarioData = res.data.usuario || res.data;
        console.log(usuarioData)
        localStorage.setItem('id_usuario', usuarioData.id_usuario);
        localStorage.setItem('id_rol', usuarioData.id_rol);
        localStorage.setItem('rol', usuarioData.rol);

        if (usuarioData.rol == "administrador" && usuarioData.cargo) {
          localStorage.setItem('cargo', usuarioData.cargo);
        }

        if (usuarioData.permisos) {
          localStorage.setItem('permisos', JSON.stringify(usuarioData.permisos));
        }

        this.showVerificationModal.set(false);
        this.showSuccessModal.set(true);

        setTimeout(() => {
          if (usuarioData.cargo === 'soporte') {
            this.router.navigate(['/administrador']);
          } else if (usuarioData.cargo === 'admin') {
            this.router.navigate(['/osi']);
          } else if (usuarioData.rol === 'medico') {
            this.router.navigate(['/medico']);
          } else {
            this.router.navigate(['/paciente']);
          }
        }, 2000);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error de verificación OTP:', err);
        this.showErrorModal.set(true);
        // 🔹 6. Manejo del error para el OTP
        this.errorMessage.set(err.error?.message || 'Código incorrecto o expirado');
        this.loading.set(false);
      }
    });
  }

  // Método para cancelar y limpiar credenciales
  cancelVerification() {
    this.showVerificationModal.set(false);
    this.loginCredentials = null;
  }

  // Método para cerrar modal de éxito inmediatamente
  closeSuccessModal() {
    this.showSuccessModal.set(false);
  }

  // Método para cerrar modal de error
  closeErrorModal() {
    this.showErrorModal.set(false);
    this.errorMessage.set('');
  }

  // Métodos para redirección a registros
  irARegistroPaciente() {
    this.router.navigate(['/solicitar-acceso']);
  }

  irARegistroMedico() {
    this.router.navigate(['/solicitar-medico']);
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    localStorage.clear();
  }
}