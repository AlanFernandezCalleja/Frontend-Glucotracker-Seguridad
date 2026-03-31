import { Component, HostListener,OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
// Tipos mínimos para que el TS no se queje
type Registro  = { fecha: string; hora: string; momento: string; glucosa: string; alerta:{nivel:string,observacion:string,mensaje:string;} };
type DiaHist   = { fecha: string; registros: Registro[] };

interface PacienteDetalle {
  id: number | string;
  nombre: string;
  ci: string;
  fechaNac: string;
  genero: string;
  peso: string;
  altura: string;
  actividadFisica:string;
  telefono: string;
  Correo: string;
  afecciones: { afeccion: string }[];
  tratamientos: { titulo: string; desc: string; dosis: string }[];
  historial: DiaHist[];
  numero_emergencia:string,
  nombre_emergencia:string,
  foto_perfil:string;
 
}

@Component({
  selector: 'app-detalle-paciente',
  standalone: true,
  imports:[CommonModule,HttpClientModule],
  templateUrl: './detalle-paciente.html',
  styleUrls: ['./detalle-paciente.scss']
})
export class DetallePaciente implements OnInit {
  private router = inject(Router); 
  paciente!: PacienteDetalle;
     isModalOpen = false;
  modalDia: DiaHist | null = null;
  modalAlertas: { nivel: string; observacion: string; hora: string }[] = [];
  // --- Config de la gráfica ---
  readonly CHART = { w: 360, h: 200, m: { top: 24, right: 12, bottom: 26, left: 36 } };
  readonly YMIN = 50;
  readonly YMAX = 180;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // vienes navegando con: this.router.navigate(['...'], { state: { paciente }})
    this.paciente = history.state.paciente as PacienteDetalle;
    // console.log('Paciente completo:', this.paciente);
    console.log(this.paciente)
    
  }

  // ===== KPIs =====
  promedioGlucosa(): number {
    const d = this.paciente?.historial?.[0];
    if (!d?.registros?.length) return 0;
    const vals = d.registros.map(r => Number(r.glucosa));
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  alertasGeneradas(): number {
    let alertas=0
    for(let a of this.paciente.historial){
      for(let b of a.registros){
        if(b.alerta!=null){
          alertas++;
        }
      }
    }
    return alertas;
  }
  
  promedioDia(d: DiaHist): number {
    if (!d?.registros?.length) return 0;
    const vals = d.registros.map(r => Number(r.glucosa));
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  // ===== Gráfica: series Mañana/Tarde/Noche a partir del historial =====
  private days(): DiaHist[] {
    return (this.paciente?.historial ?? []).slice(0, 7); // hasta 7 días
  }

  series() {
    const manana: number[] = [];
    const tarde : number[] = [];
    const noche : number[] = [];
    for (const d of this.days()) {
      const r = d.registros || [];
      if (r[0]) manana.push(+r[0].glucosa);
      if (r[1]) tarde.push(+r[1].glucosa);
      if (r[2]) noche.push(+r[2].glucosa);
    }
    return { manana, tarde, noche };
  }

  yTicks(): number[] {
    const step = 20; const out: number[] = [];
    for (let v = this.YMIN; v <= this.YMAX; v += step) out.push(v);
    return out;
  }

  private innerW() { return this.CHART.w - this.CHART.m.left - this.CHART.m.right; }
  private innerH() { return this.CHART.h - this.CHART.m.top - this.CHART.m.bottom; }

  mapX(index: number, count: number) {
    if (count <= 1) return this.CHART.m.left;
    const step = this.innerW() / (count - 1);
    return this.CHART.m.left + index * step;
    // (usada en el template para ticks/leyenda si lo deseas)
  }

  mapY(v: number) {
    const c = Math.max(this.YMIN, Math.min(this.YMAX, v));
    const t = (c - this.YMIN) / (this.YMAX - this.YMIN);
    return this.CHART.m.top + (1 - t) * this.innerH();
  }

  private polylinePoints(values: number[], totalCount: number): string {
    return values.map((v, i) => `${this.mapX(i, totalCount)},${this.mapY(v)}`).join(' ');
  }

  chartData() {
    const { manana, tarde, noche } = this.series();
    const total = Math.max(manana.length, tarde.length, noche.length, 2); // mínimo 2
    return {
      total,
      mananaPts: this.polylinePoints(manana, total),
      tardePts : this.polylinePoints(tarde , total),
      nochePts : this.polylinePoints(noche , total),
      yTicks   : this.yTicks(),
    };
  }

 coincideAlerta(registro: Registro): boolean {
    return !!registro.alerta; // true si existe alerta
  }
  openModal(dia: DiaHist) {
    this.modalDia = dia;
    // precomputar alertas para no recalcular en el template
    this.modalAlertas = (dia.registros ?? [])
      .filter(r => !!r.alerta)
      .map(r => ({ nivel: r.alerta!.nivel, observacion: r.alerta!.observacion, hora: r.hora }));

    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';   // bloquea scroll del fondo
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalDia = null;
    this.modalAlertas = [];
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.isModalOpen) this.closeModal(); }

  ordinalEs(n: number) {
    if (n === 1) return '1er';
    if (n === 2) return '2do';
    if (n === 3) return '3er';
    return `${n}to`;
  }

  registrarToma(){
    this.router.navigate(['/medico/registrarGlucosa'], { state: { paciente: this.paciente } })
  }


  downloadPdf(paciente: any) {
  const fechaActual = new Date();
  const fecha = fechaActual.toISOString().split('T')[0];
  this.http.post('http://localhost:3000/api/paciente/pdf', paciente, {
    responseType: 'blob'
  }).subscribe((pdfBlob: Blob) => {
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paciente_${paciente.nombre}_${fecha}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

}
