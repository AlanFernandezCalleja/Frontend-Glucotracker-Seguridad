import { Component,signal } from '@angular/core';
import { AdSidebar } from '../componentes/ad-sidebar/ad-sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-shell',
  imports: [AdSidebar,RouterOutlet,CommonModule],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
})
export class AdminShell {
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
