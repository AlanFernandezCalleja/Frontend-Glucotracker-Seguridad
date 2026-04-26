// import { Component, computed, signal, inject, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { CardAdminA, PerfilAdmin } from '../../componentes/card-admin-a/card-admin-a';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { environment } from '../../../../../../environments/environment';
// @Component({
//   selector: 'app-admins-activos',
//   imports: [CardAdminA, CommonModule, HttpClientModule],
//   templateUrl: './admins-activos.html',
//   styleUrl: './admins-activos.scss',
// })
// export class AdminsActivos {
//   private router = inject(Router);
//   constructor(
//     private http: HttpClient
//   ) { }
//   administradores = signal<PerfilAdmin[]>([]);
//   ngOnInit() {
//     this.cargarAdmins();

//   }
//   q = signal<string>('');

//   // lista filtrada (por nombre o CI)
//   // Computed para la lista filtrada
//   adminsFiltrados = computed(() => {
//     const query = this.q().toLowerCase();
//     return this.administradores()
//       .filter(p =>
//         p.nombre.toLowerCase().includes(query) ||
//         p.id.toString().includes(query)
//       );
//   });

//   verAdmin(m: PerfilAdmin) {
//     this.router.navigate(['administrador/administradores/activos/detalle'], { state: { admin: m } });

//   }

//   cargarAdmins() {
//     const url = `${environment.apiUrl}/administradores/obtenerAdmins/${localStorage.getItem('id_rol')}`;
//     this.http.get<PerfilAdmin[]>(url).subscribe({
//       next: (response) => {
//         console.log(response)
//         this.administradores.set(response);

//         console.log(this.administradores)
//       },
//       error: (err) => {
//         console.log('error ', err)
//       }
//     })
//   }
// }




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE para los checkboxes
import { environment } from '../../../../../../environments/environment';

// Actualizamos tu interfaz para incluir los permisos
export interface PerfilAdmin {
  id: string;
  nombre: string;
  correo: string;
  fechaNac: string;
  telefono: string;
  cargo: string;
  fechain: string;
  admitidopor: string;
  permisos?: { // <-- Propiedad añadida para manejar la vista
    editar: boolean;
    eliminar: boolean;
    ver: boolean;
    agregar: boolean;
  };
}

@Component({
  selector: 'app-admins-activos',
  // Quitamos CardAdminA y agregamos FormsModule
  imports: [CommonModule, HttpClientModule, FormsModule], 
  templateUrl: './admins-activos.html',
  styleUrl: './admins-activos.scss',
})
export class AdminsActivos implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient); // Inyección con el estilo moderno de Angular

  administradores = signal<PerfilAdmin[]>([]);
  q = signal<string>('');

  ngOnInit() {
    this.cargarAdmins();
  }

  // Computed para la lista filtrada
  adminsFiltrados = computed(() => {
    const query = this.q().toLowerCase();
    return this.administradores().filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  });

  verAdmin(m: PerfilAdmin) {
    this.router.navigate(['administrador/administradores/activos/detalle'], { state: { admin: m } });
  }
  adminsOriginales:any[]=[];
  hayCambios=false;

  cargarAdmins() {
    const url = `${environment.apiUrl}/administradores/obtenerAdmins/${localStorage.getItem('id_usuario')}`;
    this.http.get<PerfilAdmin[]>(url,
      {withCredentials:true}
    ).subscribe({
      next: (response) => {
        // Mapeamos la respuesta para inicializar los checkboxes
        const adminsConPermisos = response.map(admin => ({
          ...admin,
          permisos: admin.permisos || {
            editar: false,
            eliminar: false,
            ver: false,
            agregar: false
          }
        }));

      this.administradores.set(adminsConPermisos);
      this.adminsOriginales = JSON.parse(JSON.stringify(response));

      this.hayCambios = false;
      },
      error: (err) => {
        console.log('error ', err);
      }
    });
  }

  // Método opcional para detectar cambios en los checkboxes
  actualizarPermisos() {
  const data = this.administradores();

  this.http.post(`${environment.apiUrl}/administradores/actualizar-permisos`, data, {
    withCredentials: true
  }).subscribe({
    next: () => console.log('Permisos actualizados'),
    error: (err) => console.error(err)
  });
}
verificarCambios() {
  const actuales = this.administradores();

  this.hayCambios = actuales.some((admin, index) => {
    const original = this.adminsOriginales[index];

    return JSON.stringify(admin.permisos) !== JSON.stringify(original.permisos);
  });
}
} 

