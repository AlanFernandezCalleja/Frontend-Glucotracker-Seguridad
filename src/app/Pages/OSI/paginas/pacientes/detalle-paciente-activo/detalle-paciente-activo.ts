import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment';

// 🔹 1. Interfaz para la respuesta estandarizada
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface PacienteResumen {
  id: number | string;
  id_usuario: string;
  estado: boolean; // 👈 Usaremos esto para saber si está activo o suspendido
  nombre: string;
  ci: string;
  fechaNac: String;
  genero: String;
  peso: String;
  altura: String;
  actividadFisica: string;
  telefono: String;
  Correo: String;
  afecciones: Afecciones[];
  tratamientos: Tratamientos[];
  historial: Historial[] | null;
  admitidoPor: string;
  medico: string;
  nombre_emergencia: string;
  numero_emergencia: string;
  foto_perfil: string;
}

export interface Afecciones { afeccion: string; }
export interface Tratamientos { titulo: string; desc: string; dosis: string; }
export interface Historial { fecha: string; registros: Registro[]; }
export interface Registro { fecha: string; hora: string; momento: string; glucosa: string; alerta: Alerta | null; }
export interface Alerta { nivel: string; observacion: string; mensaje: string; }

@Component({
  selector: 'app-detalle-paciente-activo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-paciente-activo.html',
  styleUrl: './detalle-paciente-activo.scss',
})
export class DetallePacienteActivo implements OnInit {
  paciente!: PacienteResumen;
  private http = inject(HttpClient);

  // 🔹 2. Variable para manejar el estado de carga del botón
  loading = false;

  ngOnInit() {
    this.paciente = history.state.paciente as PacienteResumen;
    console.log('Paciente completo recibido:', this.paciente);
  }

  // 🔹 3. Método para suspender o activar al paciente dinámicamente
  toggleEstado() {
    if (!this.paciente) return;

    this.loading = true;
    const id = this.paciente.id_usuario;

    // Determinamos la acción y el endpoint según el estado actual
    const accion = this.paciente.estado ? 'suspender' : 'reactivar';
    const url = `${environment.apiUrl}/administradores/${accion}/${id}`;

    this.http.patch<ApiResponse<any>>(url, {}, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log(res.message);
        // Cambiamos el estado localmente para que la vista se actualice al instante
        this.paciente.estado = !this.paciente.estado;
        this.loading = false;
        alert(res.message);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Error al procesar la solicitud';
        alert('Error: ' + msg);
      }
    });
  }
}