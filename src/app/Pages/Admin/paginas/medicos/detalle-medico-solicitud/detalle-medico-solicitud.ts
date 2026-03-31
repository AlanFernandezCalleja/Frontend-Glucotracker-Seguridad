import { Component, OnInit, inject } from '@angular/core';
import { PerfilModelo } from '../../componentes/card-medico-a/card-medico-a';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-medico-solicitud',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './detalle-medico-solicitud.html',
  styleUrl: './detalle-medico-solicitud.scss',
})
export class DetalleMedicoSolicitud implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  medico!: PerfilModelo;
  pdf!: SafeResourceUrl;
  
  // Variables para control de modales
  mostrarModalAceptar = false;
  mostrarModalRechazar = false;
  mostrarModalExito = false;
  mostrarModalError = false;
  
  operacionActual: 'aceptar' | 'rechazar' | null = null;
  mensajeError = '';

  ngOnInit() {
    this.medico = history.state.medico as PerfilModelo;
    
    if (this.medico && this.medico.matricula) {
      this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.medico.matricula);
    }
  }

  // Métodos para abrir modales
  activarMedico() {
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

  // Método para rechazar médico
  rechazarMedico() {
    this.mostrarModalRechazar = false;
    // Aquí iría la lógica para rechazar al médico
    // Por ahora, simulamos éxito
    this.operacionActual = 'rechazar';
    this.mostrarModalExito = true;
  }

  // Endpoint de activación
  activarEndpoint() {
    const activarUrl = `${environment.apiUrl}/administradores/medico/activar/${this.medico.id}`;
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
      return 'No se encontró el médico';
    } else if (err.status === 403) {
      return 'No tiene permisos';
    } else if (err.status === 409) {
      return 'El médico ya está activado';
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