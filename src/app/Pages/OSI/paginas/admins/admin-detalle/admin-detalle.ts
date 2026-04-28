import { Component } from '@angular/core';
interface PerfilAdmin {
  id: string;
  nombre: string;
  correo: string;
  fechaNac: string;
  telefono: string;
  cargo: string;
  fechaIn: string;
  admitidoPor: string
}
@Component({
  selector: 'app-admin-detalle',
  imports: [],
  templateUrl: './admin-detalle.html',
  styleUrl: './admin-detalle.scss',
})

export class AdminDetalle {
  administrador!: PerfilAdmin

  ngOnInit() {
    this.administrador = history.state.admin as PerfilAdmin;
    console.log('Paciente completo:', this.administrador);
  }


}
