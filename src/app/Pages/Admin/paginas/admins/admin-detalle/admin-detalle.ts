import { Component } from '@angular/core';
import { PerfilAdmin } from '../../componentes/card-admin-a/card-admin-a';
@Component({
  selector: 'app-admin-detalle',
  imports: [],
  templateUrl: './admin-detalle.html',
  styleUrl: './admin-detalle.scss',
})
export class AdminDetalle {
  administrador!:PerfilAdmin
  
  ngOnInit(){
    this.administrador = history.state.admin as PerfilAdmin;
      console.log('Paciente completo:', this.administrador);
  }

  
}
