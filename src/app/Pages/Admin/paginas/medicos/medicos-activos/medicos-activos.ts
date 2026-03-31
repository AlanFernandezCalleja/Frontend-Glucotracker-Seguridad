import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardMedicoA, PerfilModelo } from '../../componentes/card-medico-a/card-medico-a';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-medicos-activos',
  standalone: true, // asegurate de ponerlo si es standalone
  imports: [CardMedicoA, CommonModule, HttpClientModule], // <-- agregamos HttpClientModule
  templateUrl: './medicos-activos.html',
  styleUrls: ['./medicos-activos.scss'], // corregido
})
export class MedicosActivos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = false;
  error = '';
  medicos = signal<PerfilModelo[]>([]);
  q = signal<string>('');
 medicosFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.medicos().filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );
  });

 

  verMedico(m: PerfilModelo) {
    this.router.navigate(['administrador/medicos/activo/detalle'], { state: { medico: m } });
  }

  ngOnInit() {
      this.cargarMedicos();
      
    
  }

  cargarMedicos() {
    const medicosUrl = `${environment.apiUrl}/administradores/medicos/activos`;
     // <-- corregido typo
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
