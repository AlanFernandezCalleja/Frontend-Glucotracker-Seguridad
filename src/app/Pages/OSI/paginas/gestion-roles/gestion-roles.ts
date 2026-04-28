import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface PermisoInfo {
  id_permiso: number;
  nombre: string;
  activo: boolean;
}

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  permisos: PermisoInfo[];
}

@Component({
  selector: 'app-gestion-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-roles.html',
  styleUrl: './gestion-roles.scss'
})
export class GestionRoles implements OnInit {
  http = inject(HttpClient);
  
  roles = signal<Rol[]>([]);
  private rolesOriginales = signal<string>('');
  
  // --- Lógica del Modal ---
  mostrarModal = signal(false);
  nuevoRolNombre = '';

  permisosDisponibles = computed(() => {
    const listaRoles = this.roles();
    if (listaRoles.length === 0) return [];
    return listaRoles[0].permisos.map(p => ({ 
      id_permiso: p.id_permiso, 
      nombre: p.nombre 
    }));
  });

  hayCambios = computed(() => {
    return JSON.stringify(this.roles()) !== this.rolesOriginales();
  });

  ngOnInit() {
    this.cargarMatriz();
  }

  cargarMatriz() {
    this.http.get<Rol[]>(`${environment.apiUrl}/administradores/matriz`, { withCredentials: true })
      .subscribe({
        next: (datosBD) => {
          this.roles.set(datosBD);
          this.rolesOriginales.set(JSON.stringify(datosBD));
        },
        error: (err) => {
          console.error('Error cargando matriz:', err);
        }
      });
  }

  togglePermiso(idRol: number, idPermiso: number, event: any) {
    const isChecked = event.target.checked;
    
    this.roles.update(rolesActuales => {
      return rolesActuales.map(rol => {
        if (rol.id_rol === idRol) {
          const nuevosPermisos = rol.permisos.map(p => {
            if (p.id_permiso === idPermiso) {
              return { ...p, activo: isChecked };
            }
            return p;
          });
          return { ...rol, permisos: nuevosPermisos };
        }
        return rol;
      });
    });
  }

  hasPermiso(idRol: number, idPermiso: number): boolean {
    const rol = this.roles().find(r => r.id_rol === idRol);
    if (!rol) return false;
    
    const permiso = rol.permisos.find(p => p.id_permiso === idPermiso);
    return permiso ? permiso.activo : false;
  }

  // --- LÓGICA DE EXTRACCIÓN DE CAMBIOS ---
  obtenerCambios(): Rol[] {
    const actuales = this.roles();
    const originales: Rol[] = JSON.parse(this.rolesOriginales());
    const payloadCambios: Rol[] = [];

    actuales.forEach(rolActual => {
      // Buscamos cómo estaba este rol originalmente
      const rolOriginal = originales.find(r => r.id_rol === rolActual.id_rol);

      if (!rolOriginal) {
        // Es un rol nuevo creado desde el modal. Enviamos todos sus permisos.
        payloadCambios.push(rolActual);
      } else {
        // Es un rol existente. Filtramos SOLO los permisos cuyo estado 'activo' cambió
        const permisosModificados = rolActual.permisos.filter(pActual => {
          const pOriginal = rolOriginal.permisos.find(p => p.id_permiso === pActual.id_permiso);
          return pOriginal ? pOriginal.activo !== pActual.activo : true;
        });

        // Si este rol tuvo al menos un cambio, lo agregamos al payload de envío
        if (permisosModificados.length > 0) {
          payloadCambios.push({
            id_rol: rolActual.id_rol,
            nombre_rol: rolActual.nombre_rol,
            permisos: permisosModificados
          });
        }
      }
    });

    return payloadCambios;
  }

  guardarCambios() {
    const url = `${environment.apiUrl}/administradores/actualizarMatriz`;
    const payload = this.obtenerCambios(); // Extraemos solo lo modificado

    console.log('Enviando al servidor SOLO lo modificado:', payload);

    if (payload.length === 0) return; // Por seguridad, si no hay cambios no hace la petición
    console.log(payload)
    this.http.put(url, payload, { withCredentials: true }).subscribe({
      next: () => {
        alert('Configuración de seguridad guardada correctamente.');
        // Sincronizamos para que el nuevo estado sea el "original"
        this.rolesOriginales.set(JSON.stringify(this.roles()));
      },
      error: () => alert('Error al guardar la matriz.')
    });
  }

  // --- Modal ---
  abrirModal() {
    this.nuevoRolNombre = '';
    this.mostrarModal.set(true);
  }

  cerrarModal() { this.mostrarModal.set(false); }

  confirmarAgregarRol() {
    if (!this.nuevoRolNombre.trim()) return;

    const nuevoId = this.roles().length > 0 
      ? Math.max(...this.roles().map(r => r.id_rol)) + 1 
      : 1;

    const nuevoRol: Rol = {
      id_rol: nuevoId,
      nombre_rol: this.nuevoRolNombre,
      permisos: this.permisosDisponibles().map(p => ({
        id_permiso: p.id_permiso,
        nombre: p.nombre,
        activo: false
      }))
    };

    this.roles.update(actuales => [...actuales, nuevoRol]);
    this.cerrarModal();
  }
}