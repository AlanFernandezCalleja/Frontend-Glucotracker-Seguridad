import { Component,signal } from '@angular/core';
import { Sidebar } from '../componentes/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-osi-shell',
  imports: [Sidebar,RouterOutlet,CommonModule],
  templateUrl: './osi-shell.html',
  styleUrl: './osi-shell.scss',
})
export class OsiShell {
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
