import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SafeUrlPipe } from '../../../../../pipes/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

// 🔹 1. Interfaz de respuesta
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface PerfilModelo {
  id: string;          // id_medico
  id_usuario: string;  // 👈 IMPORTANTE: Necesario para el endpoint de usuarios
  nombre: string;
  fechaNac: string;
  telefono: string;
  correo: string;
  matricula: string;
  departamento: string;
  carnet: string;
  admitidoPor: string | null;
  estado: boolean;     // 👈 Para saber si está activo o suspendido
}

@Component({
  selector: 'app-detalle-medico-activo',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, FormsModule],
  templateUrl: './detalle-medico-activo.html',
  styleUrl: './detalle-medico-activo.scss',
})
export class DetalleMedicoActivo implements OnInit {
  medico!: PerfilModelo;
  pdf!: SafeResourceUrl;

  // 🔹 2. Inyectamos HTTP y creamos variable de carga
  private http = inject(HttpClient);
  loading = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.medico = history.state.medico as PerfilModelo;
    console.log('Médico completo:', this.medico);

    if (this.medico && this.medico.matricula) {
      const pdfUrl = this.medico.matricula;
      this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } else {
      console.warn('No se encontró la matrícula o el médico');
    }
  }

  // 🔹 3. Método para alternar el estado (Suspender / Activar)
  toggleEstado() {
    if (!this.medico) return;

    this.loading = true;
    const id = this.medico.id_usuario; // Usamos el ID del usuario

    // Decidimos qué endpoint usar según el estado actual
    const accion = this.medico.estado ? 'suspender' : 'reactivar';
    const url = `${environment.apiUrl}/administradores/${accion}/${id}`;

    this.http.patch<ApiResponse<any>>(url, {}, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log(res.message);
        // Actualizamos la vista localmente
        this.medico.estado = !this.medico.estado;
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