import { CommonModule } from '@angular/common';
import { Component, EventEmitter,Output,signal } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { PerfilModelo } from '../../paginas/perfil/perfil';
@Component({
  selector: 'app-med-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './med-sidebar.html',
  styleUrl: './med-sidebar.scss',
})
export class MedSidebar {
   @Output() logout = new EventEmitter<void>();
  openAlertas = signal(false);
  toggleAlertas(){ this.openAlertas.update(v => !v); }
  
   sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
    console.log('Sidebar open:', this.sidebarOpen()); // Para debug
  }
  
}
