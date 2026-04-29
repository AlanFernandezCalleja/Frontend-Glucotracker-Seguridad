import { Component, OnInit } from '@angular/core';
import { PerfilModelo } from '../../componentes/card-medico-a/card-medico-a';
import { SafeUrlPipe } from '../../../../../pipes/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Importar FormsModule
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-detalle-medico-activo',
  imports: [CommonModule, SafeUrlPipe, FormsModule],
  templateUrl: './detalle-medico-activo.html',
  styleUrl: './detalle-medico-activo.scss',
})
export class DetalleMedicoActivo {
  medico!: PerfilModelo;
  pdf!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  // Definición de la estructura de permisos
  /*
  listaPermisos = [
    { key: 'registrarGlucosa', label: 'Registrar Glucosa', descripcion: 'Permite anotar niveles de glucosa de pacientes.' },
    { key: 'editarPerfil', label: 'Editar Perfil', descripcion: 'Permite modificar datos del perfil médico.' },
    { key: 'verHistorial', label: 'Ver Historial', descripcion: 'Acceso a la evolución histórica de pacientes.' },
    { key: 'responderAlertas', label: 'Responder Alertas', descripcion: 'Capacidad para atender notificaciones críticas.' },
    { key: 'verAlertas', label: 'Ver Alertas', descripcion: 'Visualización del panel de alertas activas.' }
  ];

  // Estado real de los permisos (esto idealmente vendría de tu base de datos)
  permisosEstado: any = {
    registrarGlucosa: false,
    editarPerfil: false,
    verHistorial: false,
    responderAlertas: false,
    verAlertas: false
  };*/

  ngOnInit() {
    // Recibir el objeto médico desde la navegación
    this.medico = history.state.medico as PerfilModelo;
    console.log('Paciente completo:', this.medico);

    // ⚡ Solo si el objeto existe
    if (this.medico && this.medico.matricula) {
      const pdfUrl = this.medico.matricula;
      this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } else {
      console.warn('No se encontró la matrícula o el médico');
    }
  }
  /*
  togglePermiso(key: string) {
    console.log(`Permiso ${key} cambiado a:`, this.permisosEstado[key]);
    // Aquí podrías llamar a un servicio para guardar el cambio en el servidor
  }*/

} 
