import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() logout = new EventEmitter<void>();
  openAlertas = signal(false);
  toggleAlertas() { this.openAlertas.update(v => !v); }

  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
    console.log('Sidebar open:', this.sidebarOpen()); // Para debug
  }
  openAdmin = signal(false);
  toggleAdmin() { this.openAdmin.update(v => !v); }

  openPaciente = signal(false);
  togglePaciente() { this.openPaciente.update(v => !v); }

  openMedico = signal(false);
  toggleMedico() { this.openMedico.update(v => !v); }
}
