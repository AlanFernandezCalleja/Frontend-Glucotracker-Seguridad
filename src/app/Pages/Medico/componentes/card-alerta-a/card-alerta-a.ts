import { Component, EventEmitter,Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface AlertaResumen {
  id: number | string;
  nivel: String;
  idpaciente:string;
  paciente: string;
  fecha: string; // dd/MM/yyyy
  hora: string;  // HH:mm
   glucosa: number; // mg/dL
  momento: string;
  observaciones:string;
  // Puedes añadir más campos si quieres
}
@Component({
  selector: 'app-card-alerta-a',
  imports: [CommonModule],
  templateUrl: './card-alerta-a.html',
  styleUrl: './card-alerta-a.scss',
})


export class CardAlertaA {
  @Input({ required: true }) alerta!: AlertaResumen;
  @Output() ver = new EventEmitter<AlertaResumen>();

  
}
