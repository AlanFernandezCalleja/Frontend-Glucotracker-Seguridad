import { Component, HostListener, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardAlertaR, AlertaResumenR } from '../../componentes/card-alerta-r/card-alerta-r';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

// 🔹 1. Agregamos la interfaz estándar
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-alertas-resueltas',
  standalone: true, // Asumiendo que es standalone por tus imports
  imports: [CardAlertaR, CommonModule, HttpClientModule],
  templateUrl: './alertas-resueltas.html',
  styleUrl: './alertas-resueltas.scss',
})
export class AlertasResueltas implements OnInit {
  private http = inject(HttpClient);

  // ===== buscador =====
  q = '';

  alertas = signal<AlertaResumenR[]>([]);
  loading = signal(false);
  error = signal('');

  // Lista visible según búsqueda
  get visibles(): AlertaResumenR[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.alertas();

    return this.alertas().filter(a =>
      a.paciente.toLowerCase().includes(t) ||
      a.nivel.toLowerCase().includes(t) ||
      a.fecha.includes(t) ||
      a.hora.includes(t)
    );
  }

  trackById = (_: number, a: AlertaResumenR) => a.id;

  // ===== Modal "Ver detalle de alerta resuelta" =====
  isModalOpen = false;
  selected: AlertaResumenR | null = null;
  respuesta = '';

  openDetalle(a: AlertaResumenR) {
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

  // Cerrar con tecla ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isModalOpen) this.closeModal();
  }

  cargarAlertasResueltas() {
    this.loading.set(true);
    const idMedico = localStorage.getItem('id_rol');

    // 🔹 2. Tipamos la petición con ApiResponse
    this.http
      .get<ApiResponse<any[]>>(`${environment.apiUrl}/medicos/alertasResueltas/${idMedico}`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          // 🔹 3. Extraemos los datos reales
          const data = res.data || [];

          const alertasMapeadas: AlertaResumenR[] = data.map((a: any) => ({
            id: a.id,
            nivel: a.nivel,
            idpaciente: a.idpaciente?.toString() || '', // por seguridad
            paciente: a.paciente || '',
            fecha: new Date(a.fecha).toLocaleDateString('es-BO'), // dd/MM/yyyy
            hora: a.hora ? a.hora.slice(0, 5) : '', // HH:mm
            glucosa: Number(a.glucosa) || 0,
            momento: a.momento || '',
            observaciones: a.observaciones,
            mensaje: a.mensaje
          }));

          this.alertas.set(alertasMapeadas);
          console.log('Alertas resueltas cargadas:', this.alertas());
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar alertas resueltas:', err);
          this.error.set('No se pudieron cargar las alertas resueltas.');
          this.loading.set(false);
        },
      });
  }

  ngOnInit(): void {
    this.cargarAlertasResueltas();
  }
}