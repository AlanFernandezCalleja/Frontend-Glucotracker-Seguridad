import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardPacienteA, PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

// 🔹 1. Agregamos la interfaz estándar
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-pacientes-activos',
  standalone: true,
  imports: [CardPacienteA, CommonModule, HttpClientModule],
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
    this.router.navigate(['administrador/pacientes/activo/detalle'], { state: { paciente: p } });
  }

  cargarPacientes() {
    const pacientesUrl = `${environment.apiUrl}/administradores/pacientes/activos`;
    this.loading = true;

    // 🔹 2. Tipamos la petición con ApiResponse indicando que contiene un arreglo de PacienteResumen
    this.http.get<ApiResponse<PacienteResumen[]>>(pacientesUrl, { withCredentials: true }).subscribe({
      next: (res) => {
        // 🔹 3. Extraemos los datos reales desde res.data
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
    // Simulación actual
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