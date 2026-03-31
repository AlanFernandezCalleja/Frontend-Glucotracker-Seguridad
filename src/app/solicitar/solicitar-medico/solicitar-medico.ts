import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-solicitar-medico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './solicitar-medico.html',
  styleUrls: ['./solicitar-medico.scss']
})
export class SolicitarMedicoComponent implements OnInit {
  medicoForm: FormGroup;
  especialidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.medicoForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      fecha_nac: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      departamento: ['', Validators.required],
      id_especialidad: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  // Maneja selección de archivos (PDF o imagen)
matriculaProfesionalFile: File | null = null;
carnetProfesionalFile: File | null = null;

onFileSelected(event: any, tipo: string) {
  const file = event.target.files[0];
  if (!file) return;

  if (tipo === 'matricula' && file.type !== 'application/pdf') {
    alert('Seleccione un archivo PDF válido.');
    return;
  }
  if (tipo === 'carnet' && !file.type.match(/image\/(jpg|jpeg|png)/)) {
    alert('Seleccione una imagen JPG o PNG válida.');
    return;
  }

  if (tipo === 'matricula') this.matriculaProfesionalFile = file;
  else this.carnetProfesionalFile = file;
}

  // Mostrar nombre del archivo seleccionado
  getFileName(file: File): string {
    return file ? file.name : '';
  }

  // Enviar formulario
  enviarSolicitud() {
    if (this.medicoForm.valid) {
      const formData = new FormData();

      // Agregar campos normales
      Object.keys(this.medicoForm.value).forEach(key => {
        const value = this.medicoForm.value[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (this.matriculaProfesionalFile)
        formData.append('matriculaProfesional', this.matriculaProfesionalFile);
      if (this.carnetProfesionalFile)
        formData.append('carnetProfesional', this.carnetProfesionalFile);
      // Campos automáticos
      formData.append('estado', 'pendiente');
      formData.append('fecha_solicitud', new Date().toISOString().split('T')[0]);

      console.log('Datos listos para enviar:', [...formData.entries()]);
      this.enviarAlBackend(formData);
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }

  // Consumir endpoint del backend
  enviarAlBackend(formData: FormData) {
    const url =`${environment.apiUrl}/medicos/registrar`; // 🔹 Tu endpoint backend real

    this.http.post(url, formData).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        alert('Solicitud enviada exitosamente');
        this.medicoForm.reset();
      },
      error: (error) => {
        console.error('❌ Error al enviar solicitud:', error);
        alert('Error al enviar solicitud. Por favor, intente nuevamente.');
      }
    });
  }

  // Cargar especialidades desde el backend
  cargarEspecialidades() {
    this.http.get<any[]>(`${environment.apiUrl}/general/especialidades`).subscribe({
      next: (data) => {
        this.especialidades = data.map(item => ({
          id_especialidad: item.id_especialidad,
          nombre: item.nombre
        }));
        console.log('Especialidades cargadas:', this.especialidades);
      },
      error: (err) => console.error('Error al obtener especialidades:', err)
    });
  }

  // Volver al login
  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}
