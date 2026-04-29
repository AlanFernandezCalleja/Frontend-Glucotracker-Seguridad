import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment';

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

interface PerfilAdmin {
  id_admin: string;
  id_usuario: string;
  nombre: string;
  correo: string;
  fechaNac: string;
  telefono: string;
  cargo: string;
  fechaIn: string;
  admitidoPor: string;
  estado: boolean;
}

@Component({
  selector: 'app-admin-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-detalle.html',
  styleUrl: './admin-detalle.scss',
})
export class AdminDetalle implements OnInit {
  private http = inject(HttpClient);
  administrador!: PerfilAdmin;
  loading = false;

  ngOnInit() {
    // Recuperamos el objeto enviado por el state del router
    this.administrador = history.state.admin as PerfilAdmin;
  }

  // Método único para gestionar el cambio de estado
  toggleEstado() {
    if (!this.administrador) return;

    this.loading = true;
    const id = this.administrador.id_usuario;

    // Determinamos la acción y el endpoint según el estado actual
    const accion = this.administrador.estado ? 'suspender' : 'reactivar';
    const url = `${environment.apiUrl}/administradores/${accion}/${id}`;

    this.http.patch<ApiResponse<any>>(url, {}, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log(res.message);
        // Actualizamos el estado localmente para que la vista cambie de inmediato
        this.administrador.estado = !this.administrador.estado;
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