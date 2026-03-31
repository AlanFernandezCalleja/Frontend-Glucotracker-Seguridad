import { Component,Input, Output , EventEmitter} from '@angular/core';
import { RouterLink } from '@angular/router';
export interface PerfilModelo{
  id:string;
  nombre:string;
  fechaNac:string;
  telefono:string;
  correo:string;
  matricula:string;
  departamento:string;
  carnet:string;
  admitidoPor:string|null
}
@Component({
  selector: 'app-card-medico-a',
  imports: [],
  templateUrl: './card-medico-a.html',
  styleUrl: './card-medico-a.scss',
})
export class CardMedicoA {
 @Input() medico!: PerfilModelo;
    @Output() ver = new EventEmitter<PerfilModelo>();
}
