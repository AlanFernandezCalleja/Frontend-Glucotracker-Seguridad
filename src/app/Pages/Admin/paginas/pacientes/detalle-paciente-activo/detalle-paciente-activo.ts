import { Component } from '@angular/core';
import { PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detalle-paciente-activo',
  imports: [CommonModule],
  templateUrl: './detalle-paciente-activo.html',
  styleUrl: './detalle-paciente-activo.scss',
})
export class DetallePacienteActivo {
   paciente!: PacienteResumen;
   ngOnInit() {
    // vienes navegando con: this.router.navigate(['...'], { state: { paciente }})
    this.paciente = history.state.paciente as PacienteResumen;
    console.log('Paciente completo:', this.paciente);
  }
}
