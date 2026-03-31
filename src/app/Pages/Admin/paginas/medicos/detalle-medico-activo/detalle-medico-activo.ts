import { Component ,OnInit} from '@angular/core';
import { PerfilModelo } from '../../componentes/card-medico-a/card-medico-a';
import { SafeUrlPipe } from '../../../../../pipes/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-detalle-medico-activo',
  imports: [CommonModule,SafeUrlPipe],
  templateUrl: './detalle-medico-activo.html',
  styleUrl: './detalle-medico-activo.scss',
})
export class DetalleMedicoActivo {
 medico!: PerfilModelo;
  pdf!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Recibir el objeto médico desde la navegación
    this.medico = history.state.medico as PerfilModelo;
    console.log('Paciente completo:', this.medico);

    // ⚡ Solo si el objeto existe
    if (this.medico && this.medico.matricula) {
      const pdfUrl = this.medico.matricula;
      this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } else {
      console.warn('No se encontró la matrícula o el médico');
    }
  }
} 
