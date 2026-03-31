import { Component,computed,signal ,inject,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardAdminA , PerfilAdmin} from '../../componentes/card-admin-a/card-admin-a';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-admins-activos',
  imports: [CardAdminA,CommonModule,HttpClientModule],
  templateUrl: './admins-activos.html',
  styleUrl: './admins-activos.scss',
})
export class AdminsActivos {
  private router = inject(Router);
   constructor(
    private http: HttpClient
  ){}
  administradores=signal<PerfilAdmin[]>([]);
  ngOnInit(){
    this.cargarAdmins();
    
  }
  q = signal<string>('');
    
      // lista filtrada (por nombre o CI)
       // Computed para la lista filtrada
      adminsFiltrados = computed(() => {
  const query = this.q().toLowerCase();
  return this.administradores()
    .filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
});

      verAdmin(m: PerfilAdmin){
        this.router.navigate(['administrador/administradores/activos/detalle'], { state: { admin: m } });

      }

      cargarAdmins(){
        const url=`${environment.apiUrl}/administradores/obtenerAdmins/${localStorage.getItem('id_rol')}`;
        this.http.get<PerfilAdmin[]>(url).subscribe({
          next:(response)=>{
            console.log(response)
            this.administradores.set(response);

            console.log(this.administradores)
          },
          error:(err)=>{
            console.log('error ',err)
          }
        })
      }
   
  
  
      
}
