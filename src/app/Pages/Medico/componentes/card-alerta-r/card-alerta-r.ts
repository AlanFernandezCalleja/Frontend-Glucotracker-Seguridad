import { Component, EventEmitter,Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface AlertaResumenR {
  id: number | string;
  nivel: String;
  idpaciente:String;
  paciente: string;
  fecha: string; // dd/MM/yyyy
  hora: string;  // HH:mm
  glucosa: number; // mg/dL
  momento: string;
  observaciones:string;
  mensaje:string;
  // Puedes añadir más campos si quieres
}
@Component({
  selector: 'app-card-alerta-r',
  imports: [CommonModule],
  templateUrl: './card-alerta-r.html',
  styleUrl: './card-alerta-r.scss',
})
export class CardAlertaR {
   @Input({ required: true }) alerta!: AlertaResumenR;
    @Output() ver = new EventEmitter<AlertaResumenR>();
}
