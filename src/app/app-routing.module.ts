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

export interface IRouteData {
  isPublic: boolean;
}

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/Menu',
    pathMatch: 'full',
    data: <IRouteData>{
      isPublic: true,
    }
  },
  {
    path: 'resetpassword/:token',
    component: CambiarContrasenaOlvidadaComponent,
    title: 'Cambiar Contraseña',
    canActivate: [UserGuard],
    data: <IRouteData>{
      isPublic: true,
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserGuard],
    title: 'Login',
    data: <IRouteData>{
      isPublic: true,
    }
  },
  {
    path: 'app',
    canActivate: [UserGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'Alojamientos/Listado',
        component: ListadoAlojamientoComponent,
        title: 'Listado de Alojamientos',
        data: <IRouteData>{
          isPublic: false,
        }
      },
      {
        path: 'Habitaciones/Listado',
        component: ListadoHabitacionComponent,
        title: 'Listado de Habitaciones',
        data: <IRouteData>{
          isPublic: false,
        }
      },
      {
        path: 'Usuarios/Listado',
        component: ListadoUsuarioComponent,
        title: 'Listado de Usuarios',
        data: <IRouteData>{
          isPublic: false,
        }
      },
      {
        path: 'Clientes/Listado',
        component: ListadoClienteComponent,
        title: 'Listado de Clientes',
        data: <IRouteData>{
          isPublic: false,
        }
      },
      {
        path: 'Reservas/Listado',
        component: ListadoReservaComponent,
        title: 'Listado de Reservas',
        data: <IRouteData>{
          isPublic: false,
        }
      },
      {
        path: 'Menu',
        component: MenuComponent,
        title: 'Menu',
        data: <IRouteData>{
          isPublic: false,
        }
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
