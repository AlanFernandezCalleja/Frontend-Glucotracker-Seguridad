import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { PacienteCard, PacienteResumen } from '../../componentes/paciente-card/paciente-card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

// 🔹 Creamos esta interfaz para que Angular entienda la nueva estructura de tu backend
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-pacientes',
  standalone: true, // Asumiendo que usas standalone
  imports: [PacienteCard, CommonModule, HttpClientModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class Pacientes implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = false;
  error = '';

  pacientes = signal<PacienteResumen[]>([]);
  q = signal<string>('');

  pacientesFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.pacientes().filter((p) =>
      p.nombre.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  });

  verPaciente(p: PacienteResumen) {
    this.router.navigate(['/medico/detalle-paciente'], { state: { paciente: p } });
  }

  cargarPacientes() {
    const idMedico = localStorage.getItem('id_rol');
    const pacientesUrl = `${environment.apiUrl}/medicos/misPacientes/${idMedico}`;

    this.loading = true;

    // 🔹 Cambiamos el tipo de la petición a ApiResponse<PacienteResumen[]>
    this.http.get<ApiResponse<PacienteResumen[]>>(pacientesUrl, { withCredentials: true }).subscribe({
      next: (response) => {
        // 🔹 Extraemos el arreglo desde response.data
        const data = response.data;

        this.pacientes.set(Array.isArray(data) ? data : []);
        console.log('Pacientes cargados:', this.pacientes());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.error = 'No se pudieron cargar los pacientes.';
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.cargarPacientes();
  }
}