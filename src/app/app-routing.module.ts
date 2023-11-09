import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListadoAlojamientoComponent } from './components/alojamiento/listado-alojamiento/listado-alojamiento.component';
import { ListadoHabitacionComponent } from './components/habitacion/listado-habitacion/listado-habitacion.component';
import { ListadoUsuarioComponent } from './components/usuario/listado-usuario/listado-usuario.component';
import { ListadoClienteComponent } from './components/cliente/listado-cliente/listado-cliente.component';
import { LoginComponent } from './auth/login/login.component';
import { Error404Component } from './shared/error404/error404.component';
import { ListadoReservaComponent } from './components/reserva/listado-reserva/listado-reserva.component';
import { UserGuard } from './guards/user.guard';
import { MenuComponent } from './shared/menu/menu.component';

import { CambiarContrasenaOlvidadaComponent } from './auth/cambiar-contrasena-olvidada/cambiar-contrasena-olvidada.component';

import { DashboardComponent } from './shared/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'Menu',
    pathMatch: 'full'
  },
  {
    path: 'resetpassword/:token',
    component: CambiarContrasenaOlvidadaComponent,
    title: 'Cambiar Contraseña'
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
        path: 'Habitaciones/Listado',
        component: ListadoHabitacionComponent,
        title: 'Listado de Habitaciones',
      },
      {
        path: 'Usuarios/Listado',
        component: ListadoUsuarioComponent,
        title: 'Listado de Usuarios',
      },
      {
        path: 'Clientes/Listado',
        component: ListadoClienteComponent,
        title: 'Listado de Clientes',
      },
      {
        path: 'Reservas/Listado',
        component: ListadoReservaComponent,
        title: 'Listado de Reservas',
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
