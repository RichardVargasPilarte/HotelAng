import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListadoAlojamientoComponent } from './components/alojamiento/listado-alojamiento/listado-alojamiento.component';
import { FormularioAlojamientoComponent } from './components/alojamiento/formulario-alojamiento/formulario-alojamiento.component';
import { ListadoHabitacionComponent } from './components/habitacion/listado-habitacion/listado-habitacion.component';
import { FormularioHabitacionComponent } from './components/habitacion/formulario-habitacion/formulario-habitacion.component';
import { ListadoUsuarioComponent } from './components/usuario/listado-usuario/listado-usuario.component';
import { FormularioUsuarioComponent } from './components/usuario/formulario-usuario/formulario-usuario.component';
import { ListadoClienteComponent } from './components/cliente/listado-cliente/listado-cliente.component';
import { FormularioClienteComponent } from './components/cliente/formulario-cliente/formulario-cliente.component';
import { LoginComponent } from './auth/login/login.component';
import { Error404Component } from './shared/error404/error404.component';
import { ListadoReservaComponent } from './components/reserva/listado-reserva/listado-reserva.component';
import { FormularioReservaComponent } from './components/reserva/formulario-reserva/formulario-reserva.component';
import { UserGuard } from './guards/user.guard';
import { MenuComponent } from './shared/menu/menu.component';

import { ReestablecerPasswordComponent } from './auth/reestablecer-password/reestablecer-password.component';

import { CambioContrasenaComponent } from './auth/cambio-contrasena/cambio-contrasena.component';

import { ContrasenaOlvidadaComponent } from './auth/contrasena-olvidada/contrasena-olvidada.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'Menu',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'app',
    canActivate: [UserGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'Alojamientos/Listado',
        component: ListadoAlojamientoComponent,
        title: 'Listado de Alojamientos'
      },
      {
        path: 'Alojamientos/Formularios',
        component: FormularioAlojamientoComponent,
      },
      {
        path: 'Alojamientos/Formularios/:id',
        component: FormularioAlojamientoComponent,
      },
      {
        path: 'Habitaciones/Listado',
        component: ListadoHabitacionComponent,
        title: 'Listado de Habitaciones',
      },
      {
        path: 'Habitaciones/Formularios',
        component: FormularioHabitacionComponent,
      },
      {
        path: 'Habitaciones/Formularios/:id',
        component: FormularioHabitacionComponent,
      },
      {
        path: 'Usuarios/Listado',
        component: ListadoUsuarioComponent,
        title: 'Listado de Usuarios',
      },
      {
        path: 'Usuarios/Formularios',
        component: FormularioUsuarioComponent
      },
      {
        path: 'Usuarios/Formularios/:id',
        component: FormularioUsuarioComponent
      },
      {
        path: 'Clientes/Listado',
        component: ListadoClienteComponent,
        title: 'Listado de Clientes',
      },
      {
        path: 'Clientes/Formularios',
        component: FormularioClienteComponent
      },
      {
        path: 'Clientes/Formularios/:id',
        component: FormularioClienteComponent
      },
      {
        path: 'Reservas/Listado',
        component: ListadoReservaComponent,
        title: 'Listado de Reservas',
      },
      {
        path: 'Reservas/Formularios',
        component: FormularioReservaComponent
      },
      {
        path: 'Reservas/Formularios/:id',
        component: FormularioReservaComponent
      },
      {
        path: 'Menu',
        component: MenuComponent,
        title: 'Menu',
      },
    ]

  },
  { path: '**', component: Error404Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
