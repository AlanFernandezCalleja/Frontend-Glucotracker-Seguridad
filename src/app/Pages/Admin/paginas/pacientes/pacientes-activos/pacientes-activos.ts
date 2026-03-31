import { Component,computed,signal ,inject,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardPacienteA,PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-pacientes-activos',
  imports: [CardPacienteA,CommonModule,HttpClientModule],
  templateUrl: './pacientes-activos.html',
  styleUrl: './pacientes-activos.scss',
})
export class PacientesActivos implements OnInit{
  private router = inject(Router); // solo para tipado, Angular lo inyecta en runtime si decides usarlo
   private http = inject(HttpClient);

  loading = false;
  error = '';
    // Datos demo (cámbialos por tu fetch al backend)
    pacientes= signal<PacienteResumen[]>([]);
    // query de búsqueda
    q = signal<string>('');
  
    // lista filtrada (por nombre o CI)
     // Computed para la lista filtrada
    pacientesFiltrados = computed(() => {
      const query = this.q().toLowerCase();
      return this.pacientes().filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    });
    verPaciente(p: PacienteResumen){
        this.router.navigate(['administrador/pacientes/activo/detalle'], { state: { paciente: p } });
    }

    cargarPacientes(){
      const pacientesUrl = `${environment.apiUrl}/administradores/pacientes/activos`; // <-- corregido typo
          this.loading = true;
          this.http.get<PacienteResumen[]>(pacientesUrl).subscribe({
            next: (data) => {
              this.pacientes.set(Array.isArray(data) ? data : []);
              console.log('Pacientes cargados:', this.pacientes());
              this.loading = false;
      
            },
            error: (err) => {
              console.error('Error al cargar médicos:', err);
              this.error = 'No se pudieron cargar los médicos.';
              this.loading = false;
            },
          });
    }
  
    ngOnInit(){
      this.cargarPacientes();
      console.log(this.pacientes)
    }
}
