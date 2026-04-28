import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz adaptada al JSON que devuelve nuestro nuevo endpoint
export interface SolicitudResumen {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  fecha_registro: string;
}

@Component({
  selector: 'app-card-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-solicitud.html',
  styleUrl: './card-solicitud.scss'
})
export class CardSolicitud {
  @Input() solicitud!: SolicitudResumen;
  @Output() ver = new EventEmitter<SolicitudResumen>();
}