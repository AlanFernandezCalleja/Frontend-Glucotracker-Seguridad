import { Component , signal} from '@angular/core';
import { PacienteSidebar } from '../componentes/paciente-sidebar/paciente-sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-paciente-shell',
  imports: [RouterOutlet,PacienteSidebar],
  templateUrl: './paciente-shell.html',
  styleUrl: './paciente-shell.scss',
})
export class PacienteShell {
  onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
    console.log('Sidebar open:', this.sidebarOpen()); // Para debug
  }

}
