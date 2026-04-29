import { Component, inject, OnInit } from '@angular/core';
import { CardAdminA } from '../componentes/card-admin-a/card-admin-a';
import { PerfilAdmin } from '../componentes/card-admin-a/card-admin-a';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

// 🔹 1. Interfaz de respuesta estandarizada
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-perfil',
  standalone: true, // Asumido por la forma de tus imports
  imports: [HttpClientModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  administrador!: PerfilAdmin;
  idUsuario = localStorage.getItem('id_usuario');
  private http = inject(HttpClient);

  ngOnInit() {
    // 🔹 Pequeña validación por si se borra el localStorage
    if (this.idUsuario) {
      this.cargarPerfil();
    } else {
      console.error('No se encontró el ID del usuario en sesión.');
    }
  }

  cargarPerfil() {
    // 🔹 2. Tipamos la petición indicando la estructura de la respuesta
    this.http.get<ApiResponse<any>>(
      `${environment.apiUrl}/administradores/perfilAdmin/${this.idUsuario}`,
      { withCredentials: true }
    )
      .subscribe({
        next: (res) => {
          // 🔹 3. Extraemos la data del backend
          const data = res.data;

          // 🔹 4. El backend ahora respeta las mayúsculas (fechaNac, fechaIn, admitidoPor)
          this.administrador = {
            id: data.id.toString(),
            nombre: data.nombre,
            correo: data.correo,
            fechaNac: data.fechaNac,       // Viene listo desde el backend
            telefono: data.telefono,
            cargo: data.cargo,
            fechain: data.fechaIn,         // Mapeo adaptado a tu interfaz PerfilAdmin
            admitidopor: data.admitidoPor  // Mapeo adaptado a tu interfaz PerfilAdmin
          };

          console.log('Administrador cargado correctamente:', this.administrador);
        },
        error: (err) => {
          // 🔹 Manejo de errores con el mensaje de tu API
          const mensajeError = err.error?.message || 'Ocurrió un error inesperado al conectar con el servidor';
          console.error('Error al obtener administrador:', mensajeError);
        }
      });
  }
}