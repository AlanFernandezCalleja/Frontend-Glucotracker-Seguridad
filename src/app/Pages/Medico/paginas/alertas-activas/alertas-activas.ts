import { Component, HostListener,signal,inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardAlertaA, AlertaResumen } from '../../componentes/card-alerta-a/card-alerta-a';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-alertas-activas',
  standalone: true,
  imports: [CommonModule, FormsModule, CardAlertaA,HttpClientModule],
  templateUrl: './alertas-activas.html',
  styleUrls: ['./alertas-activas.scss'],
})
export class AlertasActivas implements OnInit {
  // ===== buscador =====
  q = '';
    private http = inject(HttpClient);
  // ===== demo data =====
  alertas = signal<AlertaResumen[]>([]);
  loading = signal(false);
  error = signal('');

  isSuccessOpen = false;
  // Lista visible según búsqueda
 get visibles(): AlertaResumen[] {
  const t = this.q.trim().toLowerCase();
  if (!t) return this.alertas();
  
  return this.alertas().filter(a =>
    a.paciente.toLowerCase().includes(t) ||
    a.nivel.toLowerCase().includes(t) ||
    a.fecha.includes(t) ||
    a.hora.includes(t)
  );
}


  trackById = (_: number, a: AlertaResumen) => a.id;

  // ===== Modal "Resolver alerta" =====
  isModalOpen = false;
  selected: AlertaResumen | null = null;
  respuesta = '';

  isErrorOpen = false;
  errorMessage: string | null = null;
  openDetalle(a: AlertaResumen) {
    this.selected = a;
    this.respuesta = '';
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // bloquear scroll de fondo
  }

  closeModal() {
    this.isModalOpen = false;
    this.selected = null;
    this.respuesta = '';
    document.body.style.overflow = '';
  }

  resolver() {
    const fechaActual = new Date();
    // Aquí iría tu llamada a la API para resolver la alerta
    
    const datos={
      id_medico:localStorage.getItem('id_rol'),
      fecha_registro:fechaActual.toISOString().split('T')[0],
      mensaje: this.respuesta,
      alertas_id_alerta:this.selected?.id
    }
    console.log('Resolver alerta',{datos});

    const url=`${environment.apiUrl}/medicos/responder/alerta`;
    this.http.post(url,datos).subscribe({
      next:(res)=>{
        this.isSuccessOpen=true
        this.alertas.set([]);
        this.cargarAlertas(localStorage.getItem('id_rol'));
      },
      error:(err)=>{
        this.errorMessage = err;
        this.isErrorOpen = true;
      }
    })
    
    this.closeModal();
  }

  // Cerrar con tecla ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isModalOpen) this.closeModal();
  }

  cargarAlertas(idMedico: string|null) {
    this.loading.set(true);
    this.http
      .get<AlertaResumen[]>(`${environment.apiUrl}/medicos/alertasActivas/${idMedico}`)
      .subscribe({
        next: (data) => {
          // mapear los tipos si es necesario
          const alertasMapeadas: AlertaResumen[] = data.map((a) => ({
            id: a.id,
            nivel: a.nivel,
            idpaciente: a.idpaciente.toString(),
            paciente: a.paciente,
            fecha: new Date(a.fecha).toLocaleDateString('es-BO'), // dd/MM/yyyy
            hora: a.hora.slice(0, 5), // HH:mm
            glucosa: Number(a.glucosa),
            momento: a.momento || '',
            observaciones:a.observaciones
          }));

          this.alertas.set(alertasMapeadas);
          console.log('Alertas cargadas:', this.alertas());
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar alertas:', err);
          this.error.set('No se pudieron cargar las alertas.');
          this.loading.set(false);
        },
      });
  }
  ngOnInit(){
    const idMedico=localStorage.getItem('id_rol');
    this.cargarAlertas(idMedico);
  }
}
