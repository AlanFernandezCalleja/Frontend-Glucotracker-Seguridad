import { CommonModule } from '@angular/common';
import { Component, EventEmitter,Output,signal } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { CardAdminA,PerfilAdmin } from '../../paginas/componentes/card-admin-a/card-admin-a';
@Component({
  selector: 'app-ad-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule,CardAdminA],
  templateUrl: './ad-sidebar.html',
  styleUrl: './ad-sidebar.scss',
})
export class AdSidebar {
  @Output() logout = new EventEmitter<void>();
  openPacientes = signal(false);
  togglePacientes(){ this.openPacientes.update(v => !v); }
  openMedicos = signal(false);
  toggleMedicos(){ this.openMedicos.update(v => !v); }

  openAdmin = signal(false);
  toggleAdmin(){ this.openAdmin.update(v => !v); }
  admin:PerfilAdmin={
     id:'a',
  nombre:'admin1',
  correo:'admin@correo',
  fechaNac:'12/12/12',
  telefono:'123456',
  cargo:'adminnistrador',
  fechain:'10/10/2025',
  admitidopor:'admin 2'
  }
}

