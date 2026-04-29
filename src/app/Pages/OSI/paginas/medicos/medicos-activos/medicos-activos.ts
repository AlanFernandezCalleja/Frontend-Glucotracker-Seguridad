import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

// 🔹 1. Interfaz de respuesta estandarizada
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface PerfilModelo {
  id: string;
  id_usuario: string;
  nombre: string;
  fechaNac: string;
  telefono: string;
  correo: string;
  matricula: string;
  departamento: string;
  carnet: string;
  admitidoPor: string | null;
  estado: boolean;
}

@Component({
  selector: 'app-medicos-activos',
  standalone: true,
  // 🔹 Quitamos CardMedicoA de aquí
  imports: [CommonModule, HttpClientModule],
  templateUrl: './medicos-activos.html',
  styleUrls: ['./medicos-activos.scss'],
})
export class MedicosActivos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = false;
  error = '';
  medicos = signal<PerfilModelo[]>([]);
  q = signal<string>('');

  medicosFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.medicos().filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        String(p.id).toLowerCase().includes(query)
    );
  });

  verMedico(m: PerfilModelo) {
    this.router.navigate(['osi/medicos/activos/detalle'], { state: { medico: m } });
  }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    const medicosUrl = `${environment.apiUrl}/administradores/medicos/completos`;
    this.loading = true;

    this.http.get<ApiResponse<PerfilModelo[]>>(medicosUrl, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        const data = res.data;
        this.medicos.set(Array.isArray(data) ? data : []);
        console.log('Médicos cargados:', this.medicos());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        this.error = err.error?.message || 'No se pudieron cargar los médicos.';
        this.loading = false;
      },
    });
  }
}