import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-solicitar-paciente',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './solicitar-paciente.html',
  styleUrl: './solicitar-paciente.scss'
})
export class SolicitarPaciente implements OnInit{
  pacienteForm: FormGroup;
  medicos:any[]=[];
  actividades:any[]=[];
  enfermedades:any[]=[];
  tratamientos:any[]=[];
  imagenVistaPrevia:string |ArrayBuffer|null=null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.pacienteForm = this.fb.group({
      // Datos personales
      nombre_completo: ['', Validators.required],
      fecha_nac: ['', Validators.required],
      teléfono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      foto_perfil:[null],
      nombre_emergencia:['', Validators.required],
      numero_emergencia:['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      id_medico: ['', Validators.required],
      id_actividad:['', Validators.required],
      genero: ['', Validators.required],
      embarazada: [''],
      semanas:[0],
      peso: ['', [Validators.required, Validators.min(0)]],
      altura: ['', [Validators.required, Validators.min(0)]],
      enfermedad_id: [''],
      tratamiento_id: ['', [Validators.required, Validators.min(1)]],
      dosis_: [''],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  descripcionTratamiento: string = '';
  fotoPerfilFile: File | null = null;

  modalExito:boolean=false;

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
    alert('Seleccione una imagen JPG o PNG válida.');
    return;
  }

  // GUARDA EL ARCHIVO CORRECTAMENTE
  this.fotoPerfilFile = file;

  
  // También guardarlo en el FormGroup
  this.pacienteForm.patchValue({ foto_perfil: file });
  this.pacienteForm.get("foto_perfil")?.updateValueAndValidity();

  // Vista previa
  const reader = new FileReader();
  reader.onload = () => this.imagenVistaPrevia = reader.result;
  reader.readAsDataURL(file);
}


onTratamientoChange(event: any) {
  const idSeleccionado = event.target.value;
  const tratamientoSeleccionado = this.tratamientos.find(
    (t: any) => t.id_tratamiento == idSeleccionado
  );

  if (tratamientoSeleccionado) {
    this.descripcionTratamiento = tratamientoSeleccionado.descripcion;
  } else {
    this.descripcionTratamiento = '';
  }
}

  // Método para manejar cambio de género
  onGeneroChange() {
    const genero = this.pacienteForm.get('genero')?.value;
    
    if (genero !== 'mujer') {
      // Si no es mujer, limpia el campo embarazada
      this.pacienteForm.patchValue({ embarazada: '' });
    }
  }

  enviarSolicitud() {

    if (this.pacienteForm.valid) {
      // Preparar datos para enviar
      const form = this.pacienteForm.value;
      const embarazada = this.pacienteForm.get('embarazada')?.value === true;
      const semanas = this.pacienteForm.get('semanas')?.value 
                  ? Number(this.pacienteForm.get('semanas')?.value) 
                  : null;
      const datosParaBackend = {
      nombre_completo: form.nombre_completo,
      correo: form.correo,
      contrasena: form.contrasena,
      rol: 'paciente', // valor fijo
      fecha_nac: form.fecha_nac,
      foto_perfil:this.fotoPerfilFile,
      teléfono: form.teléfono,
      id_medico: Number(form.id_medico),
      id_actividad: Number(form.id_actividad),
      genero:form.genero,
      peso: form.peso,
      altura: form.altura,
      enfermedad_id: Number(form.enfermedad_id),
      tratamiento_id: Number(form.tratamiento_id),
      dosis_: form.dosis_,
      administrador_id_admin: 1,
      nombre_emergencia:form.nombre_emergencia,
      numero_emergencia:form.numero_emergencia,
      embarazada:embarazada,
        semanas:semanas
      };
      const formData = new FormData();

      Object.entries(datosParaBackend).forEach(([key, value]) => {

        // archivo
        if (key === "foto_perfil" && value instanceof File) {
          formData.append("foto_perfil", value);
          return;
        }

        // null / undefined → string vacía
        if (value === null || value === undefined) {
          formData.append(key, "");
          return;
        }

        // boolean → convertir a string
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
          return;
        }

        // números → string
        if (typeof value === "number") {
          formData.append(key, value.toString());
          return;
        }

        // strings → 그대로
        formData.append(key, value);
      });


      console.log('Datos a enviar al backend:', datosParaBackend);
      this.enviarAlBackend(formData);
      // Enviar al backend
      
    } else {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
    }
  }

  enviarAlBackend(datos: FormData) {
    // URL de tu endpoint - CAMBIA ESTA URL
    for (const pair of datos.entries()) {
  console.log(pair[0], pair[1]);
}
    const url = `${environment.apiUrl}/pacientes/registrarPaciente`;
    
    this.http.post(url, datos).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        alert('Paciente registrado exitosamente');
        this.pacienteForm.reset();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('Error al registrar paciente. Por favor, intente nuevamente.');
      }
    });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }

   obtenerMedicos() {
    this.http.get<any[]>(`${environment.apiUrl}/medicos/ver`).subscribe({
       next: (data) => {
      // Asegura que tengas un array con id_medico y nombre_completo
      this.medicos = data.map(item => ({
        id_medico: item.id_medico,
        nombre_completo: item.usuario?.nombre_completo || 'Desconocido'
      }));
      console.log('Médicos cargados:', this.medicos);
      },
      error: (err) => console.error('Error al obtener médicos:', err)
    });
  }


  cargarFisico(){
     this.http.get<any[]>(`${environment.apiUrl}/general/niveles`).subscribe({
       next: (data) => {
      // Asegura que tengas un array con id_medico y nombre_completo
      this.actividades = data.map(item => ({
        id_actividad:item.id_nivel_actividad,
        nivel: item.descripcion || 'Desconocido'
      }));
      console.log('actividades cargados:', this.actividades);
      },
      error: (err) => console.error('Error al obtener actividades:', err)
    });
  }
  obtenerenfermedades() {
    this.http.get<any[]>(`${environment.apiUrl}/general/enfermedades`).subscribe({
       next: (data) => {
      // Asegura que tengas un array con id_medico y nombre_completo
      this.enfermedades = data.map(item => ({
        id_enfermedad: item.id_enfermedad,
        nombre_enfermedad: item.nombre_enfermedad || 'Desconocido'
      }));
      console.log('Enfermedades cargados:', this.enfermedades);
      },
      error: (err) => console.error('Error al obtener médicos:', err)
    });
  }


  cargarTratamientos(){
      this.http.get<any[]>(`${environment.apiUrl}/general/tratamientos`).subscribe({
       next: (data) => {
      // Asegura que tengas un array con id_medico y nombre_completo
      this.tratamientos = data.map(item => ({
        id_tratamiento: item.id_tratamiento,
        nombre_tratamiento: item.nombre_tratamiento,
        descripcion: item.descripcion
      }));
      console.log('tratamientos:', this.tratamientos);
      },
      error: (err) => console.error('Error al obtener tratamientos:', err)
    });
  }

  cerrarModal(){
    this.modalExito=false;
  }

  ngOnInit(){
    this.obtenerMedicos();
    this.cargarFisico();
    this.obtenerenfermedades();
    this.cargarTratamientos();
  }
}