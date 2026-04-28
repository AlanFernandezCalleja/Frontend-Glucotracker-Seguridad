import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CardSolicitud, SolicitudResumen } from '../componentes/card-solicitud/card-solicitud';// Ajusta la ruta

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardSolicitud],
  templateUrl: './solicitudes-pendientes.html',
  styleUrl: './solicitudes-pendientes.scss',
})
export class SolicitudesPendientes implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = signal(false);
  error = signal('');

  // La lista de solicitudes que viene del backend
  solicitudes = signal<SolicitudResumen[]>([]);

  // El texto del buscador
  q = signal<string>('');

  // Lista reactiva filtrada por nombre, correo o teléfono
  solicitudesFiltradas = computed(() => {
    const query = this.q().toLowerCase();
    return this.solicitudes().filter(s =>
      s.nombre_completo.toLowerCase().includes(query) ||
      s.correo.toLowerCase().includes(query) ||
      s.telefono.includes(query)
    );
  });

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    // Asegúrate de que la ruta coincida con la que pusiste en tus rutas de Express (ej. /administradores o /soporte)
    const url = `${environment.apiUrl}/administradores/solicitudes-pendientes`;

    this.loading.set(true);

    // IMPORTANTE: withCredentials es obligatorio para pasar el token de sesión a endpoints protegidos
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: (res) => {
        // Como usamos el helper (res.status, res.data), extraemos el arreglo de res.data
        const arrayData = res.data ? res.data : res;

        this.solicitudes.set(Array.isArray(arrayData) ? arrayData : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes pendientes:', err);
        this.error.set('No se pudieron cargar las solicitudes.');
        this.loading.set(false);
      }
    });
  }

  verSolicitud(s: SolicitudResumen) {
    // Redirigimos a la pantalla de detalle (que crearemos luego) pasando el objeto seleccionado
    this.router.navigate(['administrador/solicitudes-pendientes/detalle'], { state: { solicitud: s } });
  }
}