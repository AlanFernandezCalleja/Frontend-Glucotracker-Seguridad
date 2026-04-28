import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-agregar',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './agregar.html',
  styleUrl: './agregar.scss',
})
export class Agregar {
  adminForm: FormGroup;
  
  // Variables para control de modales
  mostrarModalExito = false;
  mostrarModalError = false;
  mostrarModalValidacion = false;
  
  mensajeError = '';
  datosPendientes: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.adminForm = this.fb.group({
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
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
      // Se elimina el campo "cargo" del frontend
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  registrar() {
    if (this.adminForm.valid) {
      const fechaHoy = new Date().toISOString().split('T')[0];
      
      const datosParaBackend = {
        ...this.adminForm.value,
        fecha_registro: fechaHoy,
        administrador_id_admin: localStorage.getItem("id_rol") // Asegúrate de que este ID corresponda al OSI logueado
      };

      console.log('Datos a enviar al backend:', datosParaBackend);
      
      this.datosPendientes = datosParaBackend;
      this.enviarAlBackend(datosParaBackend);
      
    } else {
      this.mostrarModalValidacion = true;
      this.marcarCamposInvalidos();
    }
  }

  enviarAlBackend(datos: any) {
    const url = `${environment.apiUrl}/administradores/agregar`;
    
    // IMPORTANTE: Se añade withCredentials para pasar el token de sesión (si usas cookies)
    this.http.post(url, datos, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.mostrarModalExito = true;
        this.adminForm.reset();
        this.datosPendientes = null;
      },
      error: (error) => {
        console.error('Error al enviar al backend:', error);
        this.mostrarError(this.obtenerMensajeError(error));
      }
    });
  }

  // Métodos para cerrar modales
  cerrarModalExito() {
    this.mostrarModalExito = false;
  }

  cerrarModalError() {
    this.mostrarModalError = false;
  }

  cerrarModalValidacion() {
    this.mostrarModalValidacion = false;
  }

  // Métodos auxiliares
  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  obtenerMensajeError(err: any): string {
    if (err.status === 400) {
      return 'Los datos enviados son incorrectos. Verifique la información.';
    } else if (err.status === 409) {
      return 'El correo electrónico ya está registrado en el sistema.';
    } else if (err.status === 403) {
      return 'No tiene permisos para registrar administradores.';
    } else if (err.status === 0) {
      return 'Error de conexión con el servidor. Verifique su internet.';
    } else {
      return 'Error al registrar personal. Por favor, intente nuevamente.';
    }
  }

  reintentarRegistro() {
    this.mostrarModalError = false;
    if (this.datosPendientes) {
      this.enviarAlBackend(this.datosPendientes);
    }
  }
  
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('contrasena')?.value;
    const confirm = form.get('confirmarContrasena')?.value;

    if (password !== confirm) {
      form.get('confirmarContrasena')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmarContrasena')?.setErrors(null);
    }
  }

  marcarCamposInvalidos() {
    Object.keys(this.adminForm.controls).forEach(key => {
      const control = this.adminForm.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
}