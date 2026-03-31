import { Component,computed,signal ,inject, OnInit} from '@angular/core';
import { PacienteCard ,PacienteResumen} from '../../componentes/paciente-card/paciente-card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-pacientes',
  imports: [PacienteCard,CommonModule,HttpClientModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class Pacientes implements OnInit{
   private router = inject(Router); // solo para tipado, Angular lo inyecta en runtime si decides usarlo
    private http = inject(HttpClient);
 
   loading = false;
   error = '';
     // Datos demo (cámbialos por tu fetch al backend)
     pacientes=signal<PacienteResumen[]>([]); // solo para tipado, Angular lo inyecta en runtime si decides usarlo

  // Datos demo (cámbialos por tu fetch al backend)
  // query de búsqueda
  q = signal<string>('');

  // lista filtrada (por nombre o CI)
   // Computed para la lista filtrada
  
  verPaciente(p: PacienteResumen){
  this.router.navigate(['/medico/detalle-paciente'], { state: { paciente: p } });}
 cargarPacientes() {
    
    const idMedico=localStorage.getItem('id_rol')
    const pacientesUrl = `${environment.apiUrl}/medicos/misPacientes/${idMedico}`;

    this.loading = true;
   this.http.get<PacienteResumen[]>(pacientesUrl).subscribe({
  next: (data) => {
    this.pacientes.set(Array.isArray(data) ? data : []);
    console.log('Pacientes cargados:', this.pacientes());
    console.log(data)
    this.loading = false;
  },
  error: (err) => {
    console.error('Error al cargar pacientes:', err);
    this.error = 'No se pudieron cargar los pacientes.';
    this.loading = false;
  },
});

  }
  pacientesFiltrados = computed(() => {
  const query = this.q().toLowerCase();
  return this.pacientes()
    .filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
    );
});

  
  ngOnInit(){
    this.cargarPacientes();
  }
  
}
