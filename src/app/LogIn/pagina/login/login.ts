import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  // Variable para guardar las credenciales temporalmente
  private loginCredentials: { id_usuario?:number, correo: string, contrasena: string } | null = null;

  constructor(private router: Router, private http: HttpClient) {}

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
  this.http.post<any>(environment.apiUrl + '/login', credentials)
    .subscribe({
      next: (res) => {
        console.log('OTP enviado:', res);

        // Guardamos id_usuario para el siguiente paso
        this.loginCredentials = { correo: credentials.correo, contrasena: credentials.contrasena };
        this.loginCredentials.id_usuario = res.id_usuario;

        // Abrir modal de verificación
        this.showVerificationModal.set(true);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error de login:', err);

        this.showErrorModal.set(true);
        this.errorMessage.set(err.error?.error || 'Error al iniciar sesión');
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
    this.errorMessage.set('Ingresa un código de 6 dígitos');
    return;
  }

  this.loading.set(true);

  this.http.post<any>(environment.apiUrl + '/verify-otp', {
    id_usuario: this.loginCredentials.id_usuario,
    codigo
  }).subscribe({
    next: (res) => {
      console.log('Login completado con OTP:', res);

      // Guardar datos en localStorage
      localStorage.setItem('id_usuario', res.id_usuario);
      localStorage.setItem('id_rol', res.id_rol);
      localStorage.setItem('rol', res.rol);

      // Mostrar modal de éxito
      this.showVerificationModal.set(false);
      this.showSuccessModal.set(true);

      setTimeout(() => {
        this.showSuccessModal.set(false);
        // Redirigir según rol
        if (res.rol === 'administrador') {
          this.router.navigate(['/administrador']);
        } else if (res.rol === 'medico') {
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
      this.errorMessage.set(err.error?.error || 'Código incorrecto o expirado');
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
    this.router.navigate(['/solicitar-paciente']);
  }

  irARegistroMedico() {
    this.router.navigate(['/solicitar-medico']);
  }



  get f() { return this.form.controls; }


  ngOnInit(): void {
    localStorage.clear();
  }
}
