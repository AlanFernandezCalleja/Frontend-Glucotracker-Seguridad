import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { GlucosaService } from './glucosa.service';
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
  selector: 'app-registrar-glucosa',
  standalone: true, // 👈 importante si usas componentes standalone
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './registrar-glucosa.html',
  styleUrls: ['./registrar-glucosa.scss'],
})
export class RegistrarGlucosa implements OnInit {
  paciente!:PacienteDetalle;
  glucosaForm: FormGroup;
  medicos: any[] = [];
  momentos: any[] = [];
  datosPaciente:any;
  datosEnviar:any={};
  respuesta:any
  datosAlert:any={};
  idRegistroGlucosa:number |null=null;
  modalAlerta:boolean=false;
  modalExito:boolean=false;
  modalConfirmacion1:boolean=false;
  modalConfirmacion2:boolean=false;
  mensajeAlerta:any
  tituloAlerta:any
  modalError:boolean=false;
  constructor(private fb: FormBuilder, private http: HttpClient,private glucosaService:GlucosaService) {
    this.glucosaForm = this.fb.group({
    
      nivel_glucosa: ['', [Validators.required, Validators.min(0)]],
      id_momento: ['', Validators.required],
      observaciones: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.paciente=history.state.paciente;
    console.log("llego a registro ",this.paciente)
    //this.obtenerMedicos();
    this.obtenerMomentos();
    this.obtenerDatosPaciente();
    this.paciente = history.state.paciente as PacienteDetalle;
    console.log(this.paciente)
  }
/*
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
*/
  obtenerMomentos() {
    this.http.get<any[]>(`${environment.apiUrl}/general/momentos`).subscribe({
      next: (data) => {
        this.momentos = data;
        console.log('Momentos cargados:', this.momentos);
      },
      error: (err) => console.error('Error al obtener momentos:', err)
    });
  }

  obtenerDatosPaciente(){
    this.http.get<any>(`${environment.apiUrl}/registro/datosGlucosa/`+this.paciente.id).subscribe({
      next:(data)=>{
        this.datosPaciente=data;
        console.log("Datos para registro",this.datosPaciente);
        if(this.datosPaciente){
          this.datosEnviar.id_medico=this.datosPaciente.id_medico;
      this.datosEnviar.edad=this.datosPaciente.edad;
      if(this.datosPaciente.embarazo!=false){
          if(this.datosPaciente.enfermedades.includes('Diabetes Gestacional')){
            this.datosEnviar.tipo='Diabetes Gestacional';
            
          }else{
            this.datosEnviar.tipo='Embarazada';
          }
      }else{
        this.datosEnviar.tipo=this.datosPaciente.enfermedades[0];
      }
    }
      }, error:(err)=>{
        alert('Error al obtener pacientes'+err)
      }
    });
    

  }
  confirmar(){
    this.modalConfirmacion1=true;
  }
  
  confirmacion1(){
    this.modalConfirmacion1=false;
    this.modalConfirmacion2=true;
    console.log(this.modalConfirmacion2)
  }

  cancelar1(){
    this.modalConfirmacion1=false;
  }

  confirmacion2(){
    this.modalConfirmacion2=false;
    this.registrarGlucosa();
  }

  cancelar2(){
    this.modalConfirmacion2=false;
  }
  registrarGlucosa() {
    if (this.glucosaForm.valid) {
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split('T')[0];
      const hora = fechaActual.toTimeString().split(' ')[0];

      const datosParaBackend = {
        ...this.glucosaForm.value,
        id_medico:localStorage.getItem("id_rol"),
        fecha,
        hora,
        id_paciente: this.datosPaciente.id_paciente
      };

      console.log('Datos a enviar al backend:', datosParaBackend);
      
      if(datosParaBackend.id_momento==1){
        this.datosEnviar.momento='ayunas'
      }else if(datosParaBackend.id_momento==2){
        this.datosEnviar.momento='despues'

      }else{
        this.datosEnviar.momento='dormir'

      }
      this.datosEnviar.valor=datosParaBackend.nivel_glucosa;
      console.log(this.datosEnviar)
      this.respuesta=(this.glucosaService.evaluarGlucosa(this.datosEnviar.edad,this.datosEnviar.tipo,this.datosEnviar.momento,this.datosEnviar.valor));
      console.log(datosParaBackend)
      this.enviarAlBackend(datosParaBackend)
      
    } else {
      alert('Por favor complete todos los campos correctamente.');
      this.glucosaForm.markAllAsTouched();
    }
  }

  enviarAlBackend(datos: any) {
  const url = `${environment.apiUrl}/medicos/registrar/glucosa`;

  this.http.post<{ message: string; registro_glucosa: { id_registro: number } }>(url, datos).subscribe({
    next: (response) => {
      // Ahora TypeScript sabe que response tiene id_registro
      this.idRegistroGlucosa = response.registro_glucosa.id_registro;

      console.log('ID del registro guardado:', this.idRegistroGlucosa);

      this.glucosaForm.reset();
      
      if(this.respuesta!='NORMAL'){
        this.generarAlerta()
      }
      else{
        this.modalExito = true;

      setTimeout(() => {
        this.modalExito = false;
      }, 5000);
      }
      
    },
    error: (error) => {
      console.error('Error al registrar glucosa:', error);
      this.modalError=true;
    }
  });
  
}


  generarAlerta() {
  const fechaActual = new Date();
  if(this.respuesta != 'NORMAL') {
    this.datosAlert.id_tipo_alerta = this.respuesta == 'HIPOGLUCEMIA' ? 1 : 2;
    this.datosAlert.id_registro = this.idRegistroGlucosa!;
    this.datosAlert.id_medico = this.datosEnviar.id_medico;
    this.datosAlert.fecha_alerta = fechaActual.toISOString().split('T')[0];
    if(this.datosAlert.id_tipo_alerta==1){
      this.tituloAlerta="Hipoglucemia";
      this.mensajeAlerta="Tu glucosa está baja. Toma una fuente de azúcar de acción rápida"+
       "y vuelve a medir en unos minutos. Se envió un "
       +"reporte a su correo para el seguimiento.";
    }else{
      this.tituloAlerta="Hiperglucemia";
      this.mensajeAlerta="Tu glucosa está elevada. Hidrátate y vuelve a medir más adelante. SSe envió un "
       +"reporte a su correo para el seguimiento.";

    }
    console.log('datos de la alerta', this.datosAlert);
    this.http.post(`${environment.apiUrl}/registro/registrarAlerta`, this.datosAlert).subscribe({
      next: (res) => {
        console.log('Alerta registrada', res)
        this.modalAlerta = true;

        setTimeout(() => {
          this.modalAlerta = false;
        }, 10000);
      },
      error: (err) => console.error('Error al registrar alerta', err)
    });
  }
}

}
