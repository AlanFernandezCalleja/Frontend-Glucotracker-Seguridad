import { Component, OnInit, inject } from '@angular/core';
import { PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-detalle-paciente-solicitud',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './detalle-paciente-solicitud.html',
  styleUrl: './detalle-paciente-solicitud.scss',
})
export class DetallePacienteSolicitud implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  paciente!: PacienteResumen;
  
  // Variables para control de modales
  mostrarModalAceptar = false;
  mostrarModalRechazar = false;
  mostrarModalExito = false;
  mostrarModalError = false;
  
  operacionActual: 'aceptar' | 'rechazar' | null = null;
  mensajeError = '';

  ngOnInit() {
    this.paciente = history.state.paciente as PacienteResumen;
  }

  // Métodos para abrir modales
  activarPaciente() {
    this.operacionActual = 'aceptar';
    this.mostrarModalAceptar = true;
  }

  mostrarModalRechazo() {
    this.operacionActual = 'rechazar';
    this.mostrarModalRechazar = true;
  }

  // Métodos para cerrar modales
  cerrarModalAceptar() {
    this.mostrarModalAceptar = false;
  }

  cerrarModalRechazar() {
    this.mostrarModalRechazar = false;
  }

  cerrarModalExito() {
    this.mostrarModalExito = false;
    this.redirigirDespuesExito();
  }

  cerrarModalError() {
    this.mostrarModalError = false;
  }

  // Confirmar activación
  confirmarActivacion() {
    this.mostrarModalAceptar = false;
    this.activarEndpoint();
  }

  // Método para rechazar paciente
  rechazarPaciente() {
    this.mostrarModalRechazar = false;
    // Aquí iría la lógica para rechazar al paciente
    // Por ahora, simulamos éxito
    this.operacionActual = 'rechazar';
    this.mostrarModalExito = true;
  }

  // Endpoint de activación
  activarEndpoint() {
    const activarUrl = `${environment.apiUrl}/administradores/paciente/activar/${this.paciente.id}`;
    const idAdmin = Number(localStorage.getItem('id_rol'));

    if (!idAdmin) {
      this.mostrarError('No hay id de administrador');
      return;
    }

    const payload = { idAdmin };
    
    this.http.put(activarUrl, payload).subscribe({
      next: (res) => {
        this.mostrarModalExito = true;
      },
      error: (err) => {
        this.mostrarError(this.obtenerMensajeError(err));
      }
    });
  }

  // Métodos auxiliares
  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  obtenerMensajeError(err: any): string {
    if (err.status === 404) {
      return 'No se encontró el paciente';
    } else if (err.status === 403) {
      return 'No tiene permisos';
    } else if (err.status === 409) {
      return 'El paciente ya está activado';
    } else if (err.status === 0) {
      return 'Error de conexión';
    } else {
      return 'Error al procesar la solicitud';
    }
  }

  reintentarOperacion() {
    this.mostrarModalError = false;
    if (this.operacionActual === 'aceptar') {
      this.activarEndpoint();
    }
  }

  redirigirDespuesExito() {
    this.router.navigate(['administrador/medicos/activos']);
  }
}