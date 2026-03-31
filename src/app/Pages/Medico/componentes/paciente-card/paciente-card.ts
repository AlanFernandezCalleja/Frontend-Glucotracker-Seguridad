import { Component,Input, Output , EventEmitter} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PacienteResumen {
  id: number | string;
  nombre: string;
  ci: string;
  fechaNac:String;
  genero:String;
  peso:String;
  altura:String;
  actividadFisica:string;
  telefono:String;
  Correo:String;
  afecciones:Afecciones[];
  tratamientos:Tratamientos[];
  historial:Historial[]|null;
  
  
}
export interface Afecciones{
  afeccion:string;
}
export interface Tratamientos{
  titulo:string;
  desc:string;
  dosis:string;
}
export interface Historial{
  fecha:string;
  registros:Registro[];
}
export interface Registro{
  fecha:string;
  hora:string;
  momento:string;
  glucosa:string;
  alerta:Alerta|null;
}
export interface Alerta{
  nivel:string;
  observacion:string;
  mensaje:string;
}
@Component({
  selector: 'app-paciente-card',
  imports: [],
  templateUrl: './paciente-card.html',
  styleUrl: './paciente-card.scss',
})
export class PacienteCard {
   @Input() paciente!: PacienteResumen;
    @Output() ver = new EventEmitter<PacienteResumen>();

  
}
