import { Component,computed,signal ,inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardMedicoA,PerfilModelo } from '../../componentes/card-medico-a/card-medico-a';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-medicos-solicitudes',
  imports: [CommonModule,CardMedicoA,HttpClientModule],
  templateUrl: './medicos-solicitudes.html',
  styleUrl: './medicos-solicitudes.scss',
})
export class MedicosSolicitudes {
  private router = inject(Router); // solo para tipado, Angular lo inyecta en runtime si decides usarlo
      private http = inject(HttpClient);

    // Datos demo (cámbialos por tu fetch al backend)
    
    loading = false;
    error = '';
    medicos = signal<PerfilModelo[]>([]);
    // query de búsqueda
    q = signal<string>('');
  
    // lista filtrada (por nombre o CI)
     // Computed para la lista filtrada
    medicosFiltrados = computed(() => {
      const query = this.q().toLowerCase();
      return this.medicos().filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );
    });

    verMedico(m: PerfilModelo){
      this.router.navigate(['administrador/medicos/solicitud/detalle'], { state: { medico: m } });


    }
    ngOnInit() {
      this.cargarMedicos();
      
    
  }
  
  cargarMedicos() {
    const medicosUrl = `${environment.apiUrl}/administradores/medicos/solicitantes`; // <-- corregido typo
    this.loading = true;
    this.http.get<PerfilModelo[]>(medicosUrl).subscribe({
      next: (data) => {
        this.medicos.set(Array.isArray(data) ? data : []);
        console.log('Médicos cargados:', this.medicos());
        this.loading = false;

      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        this.error = 'No se pudieron cargar los médicos.';
        this.loading = false;
      },
    });
    
    console.log(this.medicos);
  }

}
