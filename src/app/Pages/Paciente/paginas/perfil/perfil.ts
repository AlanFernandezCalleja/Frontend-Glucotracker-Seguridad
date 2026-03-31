import { Component, Input,OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';  
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
export interface Treatment {
  titulo: string;
  descripcion: string;
  dosis: string;
}

export interface Patient {
  nombre: string;
  id: string;
  fechaNac: string;  // ISO o dd/mm/aaaa
  genero: string;
  altura: string;    // "176 centímetros"
  peso: string;      // "80 Kilogramos"
  telefono: string;
  correo: string;
  actividadFisica: {
    nivel: 'Baja' | 'Moderada' | 'Alta';
    descripcion: string;
  };
  afecciones: string[];
  tratamientos: Treatment[];
  admitidoPor: string;
  embarazo:boolean,
  semanas_embarazo:number,
  registro_embarazo:Date;
  nombre_emergencia:string,
  numero_emergencia:string
  foto_perfil:string;
  nombre_medico:string;
  fecha_registro:Date;
}

@Component({
  selector: 'app-perfil',
  imports: [NgFor, NgIf,HttpClientModule, CommonModule ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  standalone:true,
})
export class Perfil implements OnInit{
  @Input() patient: Patient | null = null;
  private http = inject(HttpClient);
  private router = inject(Router);
  demo!: Patient ;
  get data(): Patient {
    return this.patient ?? this.demo;
  }
  semanasEmbarazoN:number=0;
  cargarPaciente() {
    const idPaciente=localStorage.getItem('id_rol')
    const url = `${environment.apiUrl}/pacientes/perfil/${idPaciente}`;
    this.http.get<Patient>(url).subscribe({
      next: (data) => {
        this.patient = data;
        console.log('Paciente cargado:', this.patient);
        this.semanasEmbarazoN=this.calcularSemanasDeEmbarazo(this.patient.registro_embarazo,this.patient.semanas_embarazo)
        console.log(this.semanasEmbarazoN)
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
      }
    });
  }
  calcularSemanasDeEmbarazo(fecha_registro: string | Date, semanas_embarazo: number): number {
  // Convertimos la fecha de registro a objeto Date si viene como string
  const fechaRegistroObj = typeof fecha_registro === 'string' ? new Date(fecha_registro) : fecha_registro;
  const hoy = new Date();

  // Calculamos la diferencia en milisegundos
  const diffMs = hoy.getTime() - fechaRegistroObj.getTime();

  // Convertimos a días
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  // Convertimos a semanas
  const semanasTranscurridas = diffDias / 7;

  // Calculamos semanas actuales
  const semanasActuales = semanas_embarazo + semanasTranscurridas;

  // Redondeamos hacia abajo a semanas completas
  return Math.floor(semanasActuales);
}
  ngOnInit() {
    if (!this.patient) {
      // Si no llega patient por Input, cargamos desde el backend
      this.cargarPaciente(); // <--- reemplaza 1 por el id que necesites
    }
  }

  editarPerfil() {
    // Navegar al componente de edición
    this.router.navigate(['/paciente/editar-paciente']);
  }
}
