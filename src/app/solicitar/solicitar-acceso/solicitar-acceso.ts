import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // Ajusta la ruta

@Component({
  selector: 'app-solicitud-acceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './solicitar-acceso.html',
  styleUrl: './solicitar-acceso.scss',
})
export class SolicitudAcceso {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  solicitudForm: FormGroup;

  // Control de Modales
  mostrarModalExito = false;
  mostrarModalError = false;
  mostrarModalValidacion = false;
  mensajeError = '';

  constructor() {
    this.solicitudForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/)
        ]
      ],
      confirmarContrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      // Teléfono adaptado a formato estándar (ajustable según el país)
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8,10}$/)]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  enviarSolicitud() {
    if (this.solicitudForm.valid) {
      const url = `${environment.apiUrl}/solicitudes/solicitarRegistro`; // Endpoint público

      // Extraemos solo lo necesario para el backend
      const { nombre, correo, contrasena, fechaNacimiento, telefono } = this.solicitudForm.value;

      const payload = {
        nombre,
        correo,
        contrasena,
        fechaNac: fechaNacimiento,
        telefono
      };
      console.log(payload)
      // Al ser un endpoint público (desde el login), normalmente no lleva withCredentials

      this.http.post(url, payload).subscribe({
        next: () => {
          this.mostrarModalExito = true;
          this.solicitudForm.reset();
        },
        error: (err) => {
          console.error('Error enviando solicitud:', err);
          this.mostrarError(this.obtenerMensajeError(err));
        }
      });

    } else {
      this.mostrarModalValidacion = true;
      this.marcarCamposInvalidos();
    }
  }

  // --- Utilidades de Validación ---
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('contrasena')?.value;
    const confirm = form.get('confirmarContrasena')?.value;
    if (password && confirm && password !== confirm) {
      form.get('confirmarContrasena')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmarContrasena')?.setErrors(null);
    }
  }

  marcarCamposInvalidos() {
    Object.keys(this.solicitudForm.controls).forEach(key => {
      const control = this.solicitudForm.get(key);
      if (control?.invalid) control.markAsTouched();
    });
  }

  // --- Modales ---
  cerrarModalExito() {
    this.mostrarModalExito = false;
    // Redirigimos al usuario al login principal
    this.router.navigate(['/login']);
  }

  cerrarModalError() { this.mostrarModalError = false; }
  cerrarModalValidacion() { this.mostrarModalValidacion = false; }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  obtenerMensajeError(err: any): string {
    if (err.status === 409) return 'Este correo ya tiene una solicitud o cuenta en el sistema.';
    if (err.status === 400) return 'Los datos enviados son incorrectos. Revise la información.';
    if (err.status === 0) return 'Error de conexión. Verifique su internet.';
    return 'Ocurrió un problema interno. Por favor intente más tarde.';
  }
}