// import { Component } from '@angular/core';
// import { PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
// import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'app-detalle-paciente-activo',
//   imports: [CommonModule],
//   templateUrl: './detalle-paciente-activo.html',
//   styleUrl: './detalle-paciente-activo.scss',
// })
// export class DetallePacienteActivo {
//    paciente!: PacienteResumen;
//    ngOnInit() {
//     // vienes navegando con: this.router.navigate(['...'], { state: { paciente }})
//     this.paciente = history.state.paciente as PacienteResumen;
//     console.log('Paciente completo:', this.paciente);
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PacienteResumen } from '../../componentes/card-paciente-a/card-paciente-a';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-detalle-paciente-activo',
  standalone: true, // Asumiendo que usas standalone components por el array 'imports'
  imports: [CommonModule],
  templateUrl: './detalle-paciente-activo.html',
  styleUrl: './detalle-paciente-activo.scss',
})
export class DetallePacienteActivo implements OnInit {
  paciente!: PacienteResumen;
  private http = inject(HttpClient);
  // Variables de estado para los permisos (inician en false por defecto)
  /*
  permisoRegistrarGlucosa: boolean = false;
  permisoVerHistorial: boolean = false;
  permisoEditarPerfil: boolean = false;

  originalRegistrarGlucosa: boolean = false;
  originalVerHistorial: boolean = false;
  originalEditarPerfil: boolean = false;*/
  ngOnInit() {
    // vienes navegando con: this.router.navigate(['...'], { state: { paciente }})
    this.paciente = history.state.paciente as PacienteResumen;
    console.log('Paciente completo recibido:', this.paciente);
    /*
        if (this.paciente && this.paciente.permisos) {
          // 1. Asignamos el estado actual
          this.permisoRegistrarGlucosa = this.paciente.permisos.includes('REGISTRAR_GLUCOSA');
          this.permisoVerHistorial = this.paciente.permisos.includes('VER_HISTORIAL_GLUCOSA');
          this.permisoEditarPerfil = this.paciente.permisos.includes('EDITAR_PACIENTE');
    
          // 2. Guardamos la "fotografía" del estado original
          this.originalRegistrarGlucosa = this.permisoRegistrarGlucosa;
          this.originalVerHistorial = this.permisoVerHistorial;
          this.originalEditarPerfil = this.permisoEditarPerfil;
        }*/
  }
  /*
  get hayCambios(): boolean {
    return (
      this.permisoRegistrarGlucosa !== this.originalRegistrarGlucosa ||
      this.permisoVerHistorial !== this.originalVerHistorial ||
      this.permisoEditarPerfil !== this.originalEditarPerfil
    );
  }*/
  // Métodos para cambiar el estado visual de cada permiso
  /*
  toggleRegistrarGlucosa() {
    this.permisoRegistrarGlucosa = !this.permisoRegistrarGlucosa;
    // Aquí a futuro llamarás a un servicio para guardar el cambio en BD
  }

  toggleVerHistorial() {
    this.permisoVerHistorial = !this.permisoVerHistorial;
    // Aquí a futuro llamarás a un servicio para guardar el cambio en BD
  }

  toggleEditarPerfil() {
    this.permisoEditarPerfil = !this.permisoEditarPerfil;
    // Aquí a futuro llamarás a un servicio para guardar el cambio en BD
  }*/
  /*
    guardarPermisos() {
      // 1. Recolectamos solo los que están en true
      const permisosSeleccionados: string[] = [];
  
      // OJO: Asegúrate de usar el texto EXACTO como está en tu base de datos
      if (this.permisoRegistrarGlucosa) permisosSeleccionados.push('REGISTRAR_GLUCOSA');
      if (this.permisoVerHistorial) permisosSeleccionados.push('VER_HISTORIAL_GLUCOSA');
      if (this.permisoEditarPerfil) permisosSeleccionados.push('EDITAR_PACIENTE');
  
      // 2. Armamos el objeto a enviar al Node.js
      const payload = {
        correo: this.paciente.ci,
        permisos_activos: permisosSeleccionados
      };
  
      console.log('Enviando a guardar:', payload);
  
      // 3. Enviamos la petición HTTP (Ajusta tu URL según corresponda)
      this.http.post(`${environment.apiUrl}/administradores/pacientes/actualizarPermisos`, payload,{withCredentials:true})
        .subscribe({
          next: (respuesta) => {
            console.log('Éxito:', respuesta);
            alert('¡Permisos guardados con éxito!');
            // Opcional: Actualizar el arreglo de permisos del paciente localmente
            this.paciente.permisos = permisosSeleccionados;
          },
          error: (error) => {
            console.error('Error al guardar:', error);
            alert('Hubo un error al guardar los permisos.');
          }
        });
    }*/
}