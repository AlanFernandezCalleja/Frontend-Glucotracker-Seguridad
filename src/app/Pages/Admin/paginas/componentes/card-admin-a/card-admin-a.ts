import { Component,Input,Output,EventEmitter } from '@angular/core';

export interface PerfilAdmin{
  id:string;
  nombre:string;
  correo:string;
  fechaNac:string;
  telefono:string;
  cargo:string;
  fechain:string;
  admitidopor:string
}
@Component({
  selector: 'app-card-admin-a',
  imports: [],
  templateUrl: './card-admin-a.html',
  styleUrl: './card-admin-a.scss',
})
export class CardAdminA {
   @Input() admin!: PerfilAdmin;
      @Output() ver = new EventEmitter<PerfilAdmin>();
}
