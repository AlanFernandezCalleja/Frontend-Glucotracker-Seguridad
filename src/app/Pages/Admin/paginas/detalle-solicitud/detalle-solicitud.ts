import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
environment
@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './detalle-solicitud.html',
  styleUrl: './detalle-solicitud.scss'
})
export class DetalleSolicitud implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Datos de la solicitud recibidos por la navegación
  solicitudPendiente: any = null;

  // Roles y selección
  roles: any[] = [];
  rolSeleccionado: any = null;

  // Catálogos para los selectores
  especialidades: any[] = [];
  medicos: any[] = [];
  actividades: any[] = [];
  enfermedades: any[] = [];
  tratamientos: any[] = [];

  // Formularios separados para mantener todo limpio
  pacienteForm!: FormGroup;
  medicoForm!: FormGroup;

  // Variables para archivos
  matriculaFile: File | null = null;
  carnetFile: File | null = null;
  fotoPerfilFile: File | null = null;
  imagenVistaPrevia: string | ArrayBuffer | null = null;
  descripcionTratamiento: string = '';

  ngOnInit() {
    // 1. Obtenemos los datos del usuario desde el estado del router
    this.solicitudPendiente = history.state.solicitud;

    // Si recargan la página y se pierde el estado, volver a la lista
    if (!this.solicitudPendiente) {
      this.router.navigate(['solicitudes-pendientes']);
      return;
    }

    // 2. Inicializamos los formularios solo con los datos faltantes
    this.inicializarFormularios();

    // 3. Cargamos los roles y catálogos
    this.cargarRoles();
    this.cargarCatalogos();
  }

  inicializarFormularios() {
    // Formulario para Paciente (excluyendo lo que ya llenó en el paso 1)
    this.pacienteForm = this.fb.group({
      foto_perfil: [null],
      nombre_emergencia: ['', Validators.required],
      numero_emergencia: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      id_medico: ['', Validators.required],
      id_actividad: ['', Validators.required],
      genero: ['', Validators.required],
      embarazada: [''],
      semanas: [0],
      peso: ['', [Validators.required, Validators.min(0)]],
      altura: ['', [Validators.required, Validators.min(0)]],
      enfermedad_id: [''],
      tratamiento_id: ['', [Validators.required, Validators.min(1)]],
      dosis_: ['']
    });

    // Formulario para Médico (excluyendo lo que ya llenó en el paso 1)
    this.medicoForm = this.fb.group({
      departamento: ['', Validators.required],
      id_especialidad: ['', Validators.required]
    });
  }

  cargarRoles() {
    this.http.get<any>(`${environment.apiUrl}/administradores/roles/obtener`).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          // Filtramos si quieres evitar que seleccionen "Soporte" para estas cuentas
          this.roles = res.data.filter((r: any) => r.nombre_rol === 'paciente' || r.nombre_rol === 'medico');
        }
      },
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  seleccionarRol(rol: any) {
    this.rolSeleccionado = rol;
  }

  // --- LÓGICA DE PACIENTES ---
  onGeneroChange() {
    if (this.pacienteForm.get('genero')?.value !== 'Femenino') {
      this.pacienteForm.patchValue({ embarazada: '' });
    }
  }

  onTratamientoChange(event: any) {
    const idSeleccionado = event.target.value;
    const tratamiento = this.tratamientos.find(t => t.id_tratamiento == idSeleccionado);
    this.descripcionTratamiento = tratamiento ? tratamiento.descripcion : '';
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
      alert('Seleccione una imagen válida.'); return;
    }
    this.fotoPerfilFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagenVistaPrevia = reader.result;
    reader.readAsDataURL(file);
  }

  // --- LÓGICA DE MÉDICOS ---
  onFileSelected(event: Event, tipo: string) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) return;

    if (tipo === 'matricula') this.matriculaFile = file;
    else this.carnetFile = file;
  }

  getFileName(file: File | null): string {
    return file ? file.name : '';
  }

  // --- CARGA DE CATÁLOGOS ---
  cargarCatalogos() {
    this.http.get<any[]>(`${environment.apiUrl}/general/especialidades`).subscribe(data => this.especialidades = data);
    this.http.get<any[]>(`${environment.apiUrl}/medicos/ver`).subscribe(data => this.medicos = data);
    this.http.get<any[]>(`${environment.apiUrl}/general/niveles`).subscribe(data => this.actividades = data);
    this.http.get<any[]>(`${environment.apiUrl}/general/enfermedades`).subscribe(data => this.enfermedades = data);
    this.http.get<any[]>(`${environment.apiUrl}/general/tratamientos`).subscribe(data => this.tratamientos = data);
  }

  // --- BOTÓN FINAL (Sin consumo aún) ---
  activarCuenta() {
    const formData = new FormData();

    // 1. Datos base
    formData.append('id_usuario', this.solicitudPendiente.id_usuario.toString());
    formData.append('rol_seleccionado', this.rolSeleccionado.nombre_rol);
    // (Opcional) formData.append('administrador_id_admin', 'ID_DEL_SOPORTE_AQUI');

    // 2. Si es paciente
    if (this.rolSeleccionado.nombre_rol === 'paciente') {
      Object.keys(this.pacienteForm.value).forEach(key => {
        const val = this.pacienteForm.value[key];
        if (val !== null && val !== undefined && val !== '') formData.append(key, val);
      });
      if (this.fotoPerfilFile) formData.append('foto_perfil', this.fotoPerfilFile);
    }

    // 3. Si es médico
    else if (this.rolSeleccionado.nombre_rol === 'medico') {
      Object.keys(this.medicoForm.value).forEach(key => {
        const val = this.medicoForm.value[key];
        if (val !== null && val !== undefined && val !== '') formData.append(key, val);
      });
      if (this.matriculaFile) formData.append('matriculaProfesional', this.matriculaFile);
      if (this.carnetFile) formData.append('carnetProfesional', this.carnetFile);
    }

    // 4. Enviar Petición PUT
    this.http.put(`${environment.apiUrl}/administradores/activar-cuenta`, formData, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.router.navigate(['administradores/solicitudes-pendientes']); // Volver a la lista
        },
        error: (err) => {
          alert(err.error.message || 'Error al activar la cuenta');
          console.error(err);
        }
      });
  }

  volver() {
    this.router.navigate(['administrador/solicitudes']);
  }
}