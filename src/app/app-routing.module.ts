import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListadoAlojamientoComponent } from './components/alojamiento/listado-alojamiento/listado-alojamiento.component';
import { FormularioAlojamientoComponent } from './components/alojamiento/formulario-alojamiento/formulario-alojamiento.component';
import { ListadoHabitacionComponent } from './components/habitacion/listado-habitacion/listado-habitacion.component';
import { FormularioHabitacionComponent } from './components/habitacion/formulario-habitacion/formulario-habitacion.component';
import { ListadoUsuarioComponent } from './components/usuario/listado-usuario/listado-usuario.component';
import { FormularioUsuarioComponent } from './components/usuario/formulario-usuario/formulario-usuario.component';
import { LoginComponent } from './auth/login/login.component';
import { Error404Component } from './shared/error404/error404.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent, title: 'Login' },
  {
    path: 'Alojamientos/Listado',
    component: ListadoAlojamientoComponent,
    title: 'Listado de Alojamientos',
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
  { path: 'Usuarios/Formularios', component: FormularioUsuarioComponent },
  { path: 'Usuarios/Formularios/:id', component: FormularioUsuarioComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
