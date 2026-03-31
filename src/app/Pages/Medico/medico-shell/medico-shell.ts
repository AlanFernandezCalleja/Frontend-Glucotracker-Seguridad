import { Component,signal } from '@angular/core';
import { MedSidebar } from '../componentes/med-sidebar/med-sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-medico-shell',
  imports: [MedSidebar,RouterOutlet],
  templateUrl: './medico-shell.html',
  styleUrl: './medico-shell.scss',
})
export class MedicoShell {
  onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
   sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
    console.log('Sidebar open:', this.sidebarOpen()); // Para debug
  }
  idUsuario = localStorage.getItem('id_usuario'); // devuelve string | null
  rol = localStorage.getItem('rol');
  idRol=localStorage.getItem('id_rol')

}
