import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

// 🔹 1. Interfaz de respuesta estandarizada
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

// 🔹 2. Actualizamos la interfaz para que coincida exactamente con el backend
export interface PerfilAdmin {
  id_admin: string;
  id_usuario: string;
  nombre: string;
  correo: string;
  fechaNac: string;
  telefono: string;
  cargo: string;
  fechaIn: string;
  admitidoPor: string; // <-- Ajustado a camelCase (P mayúscula) para hacer match con el backend
  estado: boolean;
  permisos?: any; // Lo dejamos opcional por si decides volver a usarlo en verificarCambios()
}

@Component({
  selector: 'app-admins-activos',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admins-activos.html',
  styleUrl: './admins-activos.scss',
})
export class AdminsActivos implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  administradores = signal<PerfilAdmin[]>([]);
  q = signal<string>('');

  ngOnInit() {
    this.cargarAdmins();
  }

  // Computed para la lista filtrada
  adminsFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.administradores().filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.id_admin.toString().includes(query)
    );
  });

  verAdmin(m: PerfilAdmin) {
    this.router.navigate(['/osi/administradores/activos/detalle'], { state: { admin: m } });
  }

  adminsOriginales: any[] = [];
  hayCambios = false;

  cargarAdmins() {
    const url = `${environment.apiUrl}/administradores/obtenerAdmins/${localStorage.getItem('id_usuario')}`;

    // 🔹 3. Tipamos la petición con ApiResponse
    this.http.get<ApiResponse<PerfilAdmin[]>>(url, { withCredentials: true }).subscribe({
      next: (res) => {
        // 🔹 4. Extraemos la data (el arreglo de administradores)
        const data = res.data;

        // Asignamos directamente la data al signal
        this.administradores.set(data);

        // Guardamos una copia para detectar cambios
        this.adminsOriginales = JSON.parse(JSON.stringify(data));

        console.log('Administradores cargados:', this.administradores());
        this.hayCambios = false;
      },
      error: (err) => {
        // 🔹 5. Manejo de errores con el mensaje del backend
        const mensajeError = err.error?.message || 'Error al conectar con el servidor';
        console.error('Error obteniendo administradores:', mensajeError);
      }
    });
  }

  // Método opcional para detectar cambios en los checkboxes
  actualizarPermisos() {
    const data = this.administradores();

    this.http.post(`${environment.apiUrl}/administradores/actualizar-permisos`, data, {
      withCredentials: true
    }).subscribe({
      next: () => console.log('Permisos actualizados'),
      error: (err) => console.error(err)
    });
  }

  verificarCambios() {
    const actuales = this.administradores();

    this.hayCambios = actuales.some((admin, index) => {
      const original = this.adminsOriginales[index];
      // Nota: Si quitaste el objeto 'permisos' del mapeo inicial, JSON.stringify dará undefined. 
      // Esta lógica se mantiene segura gracias al 'permisos?: any' en la interfaz.
      return JSON.stringify(admin.permisos) !== JSON.stringify(original.permisos);
    });
  }
}