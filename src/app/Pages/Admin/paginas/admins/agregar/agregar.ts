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
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      cargo: ['', Validators.required]
    });
  }

  registrar() {
    if (this.adminForm.valid) {
      // Obtener la fecha de hoy
      const fechaHoy = new Date().toISOString().split('T')[0];
      
      // Crear el objeto con los datos para enviar al backend
      const datosParaBackend = {
        ...this.adminForm.value,
        fecha_registro: fechaHoy,
        administrador_id_admin: localStorage.getItem("id_rol")
      };

      console.log('Datos a enviar al backend:', datosParaBackend);
      
      // Guardar datos por si hay que reintentar
      this.datosPendientes = datosParaBackend;
      
      // Llamar al método para enviar al backend
      this.enviarAlBackend(datosParaBackend);
      
    } else {
      // Mostrar modal de validación en lugar de alert
      this.mostrarModalValidacion = true;
      this.marcarCamposInvalidos();
    }
  }

  enviarAlBackend(datos: any) {
    const url = `${environment.apiUrl}/administradores/agregar`;
    
    this.http.post(url, datos).subscribe({
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
      return 'Error al registrar administrador. Por favor, intente nuevamente.';
    }
  }

  reintentarRegistro() {
    this.mostrarModalError = false;
    if (this.datosPendientes) {
      this.enviarAlBackend(this.datosPendientes);
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