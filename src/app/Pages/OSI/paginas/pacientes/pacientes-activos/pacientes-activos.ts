import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
export interface PacienteResumen {
  id: number | string;
  id_usuario: string;
  estado: boolean;
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
export interface Afecciones {
  afeccion: string;
}
export interface Tratamientos {
  titulo: string;
  desc: string;
  dosis: string;
}
export interface Historial {
  fecha: string;
  registros: Registro[];
}
export interface Registro {
  fecha: string;
  hora: string;
  momento: string;
  glucosa: string;
  alerta: Alerta | null;
}
export interface Alerta {
  nivel: string;
  observacion: string;
  mensaje: string;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-pacientes-activos',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Quitamos CardPacienteA de aquí
  templateUrl: './pacientes-activos.html',
  styleUrl: './pacientes-activos.scss',
})
export class PacientesActivos implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = false;
  error = '';

  pacientes = signal<PacienteResumen[]>([]);
  q = signal<string>('');

  // --- LÓGICA DE PERMISOS (RBAC) ---
  permisosRol = signal<string[]>([]);
  permisosOriginales: string[] = [];

  hayCambiosPermisos = computed(() => {
    const actuales = [...this.permisosRol()].sort();
    const originales = [...this.permisosOriginales].sort();
    return JSON.stringify(actuales) !== JSON.stringify(originales);
  });
  // ---------------------------------------

  pacientesFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.pacientes().filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
    );
  });

  verPaciente(p: PacienteResumen) {
    this.router.navigate(['osi/pacientes/activos/detalle'], { state: { paciente: p } });
  }

  cargarPacientes() {
    const pacientesUrl = `${environment.apiUrl}/administradores/pacientes/completos`;
    this.loading = true;

    this.http.get<ApiResponse<PacienteResumen[]>>(pacientesUrl, { withCredentials: true }).subscribe({
      next: (res) => {
        const data = res.data;
        this.pacientes.set(Array.isArray(data) ? data : []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.error = 'No se pudieron cargar los pacientes.';
        this.loading = false;
      },
    });
  }

  // --- MÉTODOS PARA PERMISOS ---
  cargarPermisosRol() {
    const permisosBD = ['registrar_glucosa', 'ver_historial_glucosa', 'editar_paciente'];
    this.permisosRol.set(permisosBD);
    this.permisosOriginales = [...permisosBD];
  }

  togglePermiso(permiso: string) {
    const actuales = this.permisosRol();
    if (actuales.includes(permiso)) {
      this.permisosRol.set(actuales.filter(p => p !== permiso));
    } else {
      this.permisosRol.set([...actuales, permiso]);
    }
  }

  guardarPermisosRol() {
    const payload = {
      rol: 'Paciente',
      permisos: this.permisosRol()
    };
    console.log('Enviando a BD:', payload);
    alert('Permisos globales del rol Paciente actualizados.');
    this.permisosOriginales = [...this.permisosRol()];
  }

  ngOnInit() {
    this.cargarPacientes();
    this.cargarPermisosRol();
  }
}