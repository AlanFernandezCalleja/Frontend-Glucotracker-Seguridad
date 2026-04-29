import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

// 🔹 1. Interfaz de respuesta estandarizada
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface Treatment {
  titulo: string;
  descripcion: string;
  dosis: string;
}

export interface Patient {
  nombre: string;
  id: string;
  fechaNac: string;  // ISO o dd/mm/aaaa
  genero: string;
  altura: string;    // "176 centímetros"
  peso: string;      // "80 Kilogramos"
  telefono: string;
  correo: string;
  actividadFisica: {
    nivel: 'Baja' | 'Moderada' | 'Alta' | null;
    descripcion: string | null;
  };
  afecciones: string[];
  tratamientos: Treatment[];
  admitidoPor: string;
  embarazo: boolean;
  semanas_embarazo: number | null;
  registro_embarazo: Date | null;
  nombre_emergencia: string;
  numero_emergencia: string;
  foto_perfil: string;
  nombre_medico: string;
  fecha_registro: Date;
}

@Component({
  selector: 'app-perfil',
  imports: [NgFor, NgIf, HttpClientModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  standalone: true,
})
export class Perfil implements OnInit {
  @Input() patient: Patient | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);

  demo!: Patient;

  get data(): Patient {
    return this.patient ?? this.demo;
  }

  semanasEmbarazoN: number = 0;

  cargarPaciente() {
    const idPaciente = localStorage.getItem('id_rol');
    const url = `${environment.apiUrl}/pacientes/perfil/${idPaciente}`;

    // 🔹 2. Tipamos la petición indicando que esperamos un ApiResponse que contiene un Patient
    this.http.get<ApiResponse<Patient>>(url, { withCredentials: true }).subscribe({
      next: (res) => {
        // 🔹 3. Extraemos el objeto del paciente desde res.data
        this.patient = res.data;
        console.log('Paciente cargado:', this.patient);

        // Validación de seguridad para evitar errores matemáticos si el paciente no tiene embarazo registrado
        if (this.patient.embarazo && this.patient.registro_embarazo && this.patient.semanas_embarazo !== null) {
          this.semanasEmbarazoN = this.calcularSemanasDeEmbarazo(this.patient.registro_embarazo, this.patient.semanas_embarazo);
          console.log('Semanas calculadas:', this.semanasEmbarazoN);
        } else {
          this.semanasEmbarazoN = 0;
        }
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
      }
    });
  }

  calcularSemanasDeEmbarazo(fecha_registro: string | Date, semanas_embarazo: number): number {
    // Convertimos la fecha de registro a objeto Date si viene como string
    const fechaRegistroObj = typeof fecha_registro === 'string' ? new Date(fecha_registro) : fecha_registro;
    const hoy = new Date();

    // Calculamos la diferencia en milisegundos
    const diffMs = hoy.getTime() - fechaRegistroObj.getTime();

    // Convertimos a días
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    // Convertimos a semanas
    const semanasTranscurridas = diffDias / 7;

    // Calculamos semanas actuales
    const semanasActuales = semanas_embarazo + semanasTranscurridas;

    // Redondeamos hacia abajo a semanas completas
    return Math.floor(semanasActuales);
  }

  ngOnInit() {
    if (!this.patient) {
      // Si no llega patient por Input, cargamos desde el backend
      this.cargarPaciente();
    }
  }

  editarPerfil() {
    // Navegar al componente de edición
    this.router.navigate(['/paciente/editar-paciente']);
  }
}