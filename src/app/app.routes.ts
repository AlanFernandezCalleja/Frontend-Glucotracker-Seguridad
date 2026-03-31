import { Routes } from '@angular/router';
import { SolicitarMedicoComponent } from './solicitar/solicitar-medico/solicitar-medico';
import { SolicitarPaciente } from './solicitar/solicitar-paciente/solicitar-paciente';
export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full' ,
    },
    {
        path:'login',
        loadComponent:()=>import('./LogIn/pagina/login/login').then(m=>m.Login),
    },
    { 
        path: 'solicitar-medico', 
        component: SolicitarMedicoComponent
    },
    { 
        path: 'solicitar-paciente', 
        component: SolicitarPaciente
    },
    {
        path:'administrador',
        loadComponent:()=>import('./Pages/Admin/admin-shell/admin-shell').then(m=>m.AdminShell),
        children:[
            {
                path:'',pathMatch:'full',redirectTo:'pacientes/activos'
            },
            {
                path:'pacientes/activos', loadComponent:()=>import('./Pages/Admin/paginas/pacientes/pacientes-activos/pacientes-activos').then(m=>m.PacientesActivos),
            },
            {
                path:'pacientes/solicitudes', loadComponent:()=>import('./Pages/Admin/paginas/pacientes/pacientes-solicitudes/pacientes-solicitudes').then(m=>m.PacientesSolicitudes),
            },
            {
                path:'pacientes/activo/detalle',loadComponent:()=>import('./Pages/Admin/paginas/pacientes/detalle-paciente-activo/detalle-paciente-activo').then(m=>m.DetallePacienteActivo),
            },
            {
                path:'pacientes/solicitud/detalle',loadComponent:()=>import('./Pages/Admin/paginas/pacientes/detalle-paciente-solicitud/detalle-paciente-solicitud').then(m=>m.DetallePacienteSolicitud),
            },
            {
                path:'medicos/activos',loadComponent:()=>import('./Pages/Admin/paginas/medicos/medicos-activos/medicos-activos').then(m=>m.MedicosActivos),
            },
            {
                path:'medicos/solicitudes',loadComponent:()=>import('./Pages/Admin/paginas/medicos/medicos-solicitudes/medicos-solicitudes').then(m=>m.MedicosSolicitudes),
            },
            {
                path:'medicos/activo/detalle',loadComponent:()=>import('./Pages/Admin/paginas/medicos/detalle-medico-activo/detalle-medico-activo').then(m=>m.DetalleMedicoActivo),
            },
            {
                path:'medicos/solicitud/detalle',loadComponent:()=>import('./Pages/Admin/paginas/medicos/detalle-medico-solicitud/detalle-medico-solicitud').then(m=>m.DetalleMedicoSolicitud),
            },
            {
                path:'administradores/activos', loadComponent:()=>import('./Pages/Admin/paginas/admins/admins-activos/admins-activos').then(m=>m.AdminsActivos)
            },
            {
                path:'administrador/agregar', loadComponent:()=>import('./Pages/Admin/paginas/admins/agregar/agregar').then(m=>m.Agregar),
            },
            {
                path:'perfil',loadComponent:()=>import('./Pages/Admin/paginas/perfil/perfil').then(m=>m.Perfil)
            },
            {
                path:'administradores/activos/detalle', loadComponent:()=>import('./Pages/Admin/paginas/admins/admin-detalle/admin-detalle').then(m=>m.AdminDetalle)
            },
            {
                path:'administradores/auditoria', loadComponent:()=>import('./Pages/Admin/paginas/auditoria/auditoria').then(m=>m.Auditoria)
            }
        ]
    },
    {
        path:'medico',
        loadComponent:()=>import('./Pages/Medico/medico-shell/medico-shell').then(m=>m.MedicoShell),
        children:[
             { path: '', pathMatch: 'full', redirectTo: 'pacientes' }, // default
            
             { path: 'pacientes', loadComponent: () =>import('./Pages/Medico/paginas/pacientes/pacientes').then(m => m.Pacientes)},
             
             { path: 'detalle-paciente', loadComponent: () =>
                import('./Pages/Medico/paginas/detalle-paciente/detalle-paciente').then(m => m.DetallePaciente) },

             { path: 'activas', loadComponent: () =>
                import('./Pages/Medico/paginas/alertas-activas/alertas-activas').then(m => m.AlertasActivas)},

             { path: 'resueltas', loadComponent: () =>
                import('./Pages/Medico/paginas/alertas-resueltas/alertas-resueltas').then(m => m.AlertasResueltas)
            },
            {
                path: 'perfil', loadComponent: ()=>import ('./Pages/Medico/paginas/perfil/perfil').then(m=>m.Perfil)
            },
            {
                path: 'registrarGlucosa',loadComponent:()=>import ('./Pages/Medico/paginas/registrar-glucosa/registrar-glucosa').then(m=>m.RegistrarGlucosa)
            },
            {
                path:'editar-medico', loadComponent:()=>import('./Pages/Medico/paginas/editar-medico/editar-medico').then(m=>m.EditarMedico)
            }
            
        ]
    },
    {
        path:'paciente',loadComponent:()=>import('./Pages/Paciente/paciente-shell/paciente-shell').then(m=>m.PacienteShell),
        children:[
            {
                path:'',pathMatch:'full',redirectTo:'registrar'
            },
           
            {
                path:'registrar',loadComponent:()=>import('./Pages/Paciente/paginas/registrar-glucosa/registrar-glucosa').then(m=>m.RegistrarGlucosa)
            },
             {
                path:'registros',loadComponent:()=>import('./Pages/Paciente/paginas/mis-registros/mis-registros').then(m=>m.MisRegistros)
            },
            {
                path:'perfil',loadComponent:()=>import('./Pages/Paciente/paginas/perfil/perfil').then(m=>m.Perfil)
            },
            {
                path:'editar-paciente', loadComponent:()=>import('./Pages/Paciente/paginas/editar-paciente/editar-paciente').then(m=>m.EditarPaciente)
            }
        ]
    }

];
