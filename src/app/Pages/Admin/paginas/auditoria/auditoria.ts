import { Component,computed,signal ,inject,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
export interface Usuario{
  nombre_completo:string
}
export interface Auditoria{
  id:number,
  id_usuario:number,
  rol:string,
  id_rol:number,
  endpoint:string,
  operacion:string,
  exito:boolean,
  codigo_http:number,
  ip_origen:string,
  fecha:Date,
  usuario?:Usuario
}
@Component({
  selector: 'app-auditoria',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.scss',
})
export class Auditoria {
  private router = inject(Router);
   constructor(
    private http: HttpClient
  ){}
  registros:Auditoria[]=[];
  paginaActual = 1;
  registrosPorPagina = 20;
  ngOnInit(){
    this.obtenerAuditoria();
  }
  
  obtenerAuditoria(){
    const url=`${environment.apiUrl}/general/auditoria`;
    this.http.get<Auditoria[]>(url).subscribe({
      next:(response)=>{
        this.registros = response.sort((a, b) => 
  new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
);
        console.log(this.registros)
      },
      error:(err)=>{
        console.log("Error al obtener auditoria ",err)
      }
    })
  }


   // 👉 Registros que se muestran en la tabla
  get registrosPaginados(): Auditoria[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.registros.slice(inicio, fin);
  }

  // 👉 Total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.registros.length / this.registrosPorPagina);
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  anterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }
}
