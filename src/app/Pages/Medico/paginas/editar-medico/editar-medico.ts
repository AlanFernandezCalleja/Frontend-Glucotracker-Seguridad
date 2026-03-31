import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

export interface MedicoData {
  id: string;
  nombre: string;
  fechanac: string;
  telefono: string;
  correo: string;
  matricula: string;
  departamento: string;
  carnet: string;
  admin: string;
}

@Component({
  selector: 'app-editar-medico',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './editar-medico.html',
  styleUrl: './editar-medico.scss'
})
export class EditarMedico implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  medicoId!: string;
  medicoData!: MedicoData;
  loading = false;
  guardando = false;
  
  // Signals para modales
  showSuccessModal = signal(false);
  showErrorModal = signal(false);
  errorMessage = signal('');
  showConfirmModal = signal(false);
  
  // Formulario principal
  formMedico: FormGroup;
  
  // Variable para archivo del carnet
  carnetFile: File | null = null;
  carnetPreview: string | null = null;
  carnetCambiado = false;
  constructor() {
    this.formMedico = this.fb.group({
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{8,}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      departamento: ['La Paz', [Validators.required]]
    });
  }
  
  ngOnInit() {
    // Obtener ID del médico desde localStorage
    this.medicoId = localStorage.getItem('id_usuario') || '';
    
    if (!this.medicoId) {
      console.error('No se encontró ID de médico');
      this.showError('No se encontró ID de médico. Redirigiendo...');
      setTimeout(() => this.router.navigate(['/perfil']), 2000);
      return;
    }
    
    this.cargarMedico();
  }
  
  cargarMedico() {
    this.loading = true;
    const url = `${environment.apiUrl}/medicos/perfil/${this.medicoId}`;
    
    this.http.get<MedicoData>(url).subscribe({
      next: (data) => {
        console.log(data)
        this.medicoData = data;
        this.cargarDatosEnFormulario();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar médico:', err);
        this.loading = false;
        this.showError('Error al cargar datos del médico: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
  
  cargarDatosEnFormulario() {
    this.formMedico.patchValue({
      telefono: this.medicoData.telefono,
      correo: this.medicoData.correo,
      departamento: this.medicoData.departamento || 'La Paz'
    });
    this.formMedico.markAsPristine();
    this.carnetCambiado = false;
  }
  
  onCarnetSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea una imagen
      if (!file.type.match('image.*')) {
        this.showError('El archivo debe ser una imagen (JPG, PNG, GIF)');
        event.target.value = '';
        return;
      }
      
      // Verificar tamaño máximo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showError('La imagen no debe superar los 2MB');
        event.target.value = '';
        return;
      }
      
      this.carnetFile = file;
        this.carnetCambiado = true; // 🔥 CLAVE
        console.log('Carnet cambiado:', this.carnetCambiado);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.carnetPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  eliminarCarnet() {
    this.carnetFile = null;
    this.carnetPreview = null;
      this.carnetCambiado = false;

    const input = document.getElementById('carnet') as HTMLInputElement;
    if (input) input.value = '';
  }
  
  prepararDatosParaEnvio(): FormData {
  const formData = new FormData();

  // Agregar solo campos modificados
  if (this.formMedico.get('telefono')?.dirty) {
    formData.append('telefono', this.formMedico.get('telefono')?.value);
  }
  if (this.formMedico.get('correo')?.dirty) {
    formData.append('correo', this.formMedico.get('correo')?.value);
  }
  if (this.formMedico.get('departamento')?.dirty) {
    formData.append('departamento', this.formMedico.get('departamento')?.value);
  }

  // Agregar archivo del carnet si se cambió
  if (this.carnetCambiado && this.carnetFile) {
    formData.append('carnet', this.carnetFile);
  }

  return formData;
}

  
  guardarCambios() {
  // Solo enviar si hubo cambios
  if (this.formMedico.dirty || this.carnetCambiado) {
    this.guardando = true;

    const formData = this.prepararDatosParaEnvio();
    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
    const url = `${environment.apiUrl}/medicos/actualizar/${localStorage.getItem("id_rol")}`;

    this.http.put(url, formData).subscribe({
      next: (response) => {
        console.log('Médico actualizado:', response);
        this.guardando = false;
        this.showSuccessModal.set(true);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.showSuccessModal.set(false);
          this.router.navigate(['/medico/perfil']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al actualizar médico:', err);
        this.guardando = false;
        this.showError('Error al guardar cambios: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
}

  
  confirmarCancelar() {
    this.showConfirmModal.set(true);
  }
  
  cancelar() {
    this.showConfirmModal.set(false);
    this.router.navigate(['/medico/perfil']);
  }
  
  closeConfirmModal() {
    this.showConfirmModal.set(false);
  }
  
  marcarCamposComoTocados() {
    Object.keys(this.formMedico.controls).forEach(key => {
      const control = this.formMedico.get(key);
      control?.markAsTouched();
    });
  }
  
  showError(mensaje: string) {
    this.errorMessage.set(mensaje);
    this.showErrorModal.set(true);
  }
  
  closeErrorModal() {
    this.showErrorModal.set(false);
    this.errorMessage.set('');
  }
  
  closeSuccessModal() {
    this.showSuccessModal.set(false);
    this.router.navigate(['/perfil']);
  }
  
  // Getter para acceder a los controles del formulario
  get f(): { [key: string]: FormControl } {
    return this.formMedico.controls as { [key: string]: FormControl };
  }
  
  // Departamentos de Bolivia
  get departamentos() {
    return ['La Paz', 'Cochabamba', 'Santa Cruz'];
  }
}