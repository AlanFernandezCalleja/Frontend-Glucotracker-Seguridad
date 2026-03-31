import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';

export interface PerfilModelo {
  id: string;
  nombre: string;
  fechaNac: string;
  telefono: string;
  correo: string;
  matricula: string;
  departamento: string;
  carnet: string;
  admin: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  
  pdf?: SafeResourceUrl;
  medico?: PerfilModelo;
  
  // Variables para modales
  showCarnetModal = false;
  showMatriculaModal = false;
  
  // IDs de usuario
  idUsuario = localStorage.getItem('id_usuario');
  rol = localStorage.getItem('rol');
  idRol = localStorage.getItem('id_rol');
  
  ngOnInit() {

    this.cargarPerfil();

  }
  
  cargarPerfil() {
    console.log('Cargando perfil médico, ID:', this.idUsuario);
    
    this.http.get<PerfilModelo>(`${environment.apiUrl}/medicos/perfil/${this.idUsuario}`)
      .subscribe({
        next: (data) => {
          this.medico = data;
          console.log('Médico cargado:', this.medico);
          
          if (this.medico.matricula) {
            this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.medico.matricula);
          }
        },
        error: (err) => {
          console.error('Error al obtener médico:', err);
        }
      });
  }
  
  // Método para redirigir a editar perfil
  editarPerfil() {
    console.log('Redirigiendo a editar perfil médico...');
    this.router.navigate(['/medico/editar-medico']);
  }
  
  // Métodos para modales
  verCarnet() {
    if (this.medico?.carnet) {
      this.showCarnetModal = true;
    }
  }
  
  cerrarCarnetModal() {
    this.showCarnetModal = false;
  }
  
  abrirMatricula() {
    if (this.pdf) {
      this.showMatriculaModal = true;
    }
  }
  
  cerrarMatriculaModal() {
    this.showMatriculaModal = false;
  }
}