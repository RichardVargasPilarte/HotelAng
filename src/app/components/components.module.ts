import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';

import { ListadoAlojamientoComponent } from './alojamiento/listado-alojamiento/listado-alojamiento.component';
import { FormularioAlojamientoComponent } from './alojamiento/formulario-alojamiento/formulario-alojamiento.component';
import { FormularioHabitacionComponent } from './habitacion/formulario-habitacion/formulario-habitacion.component';
import { ListadoHabitacionComponent } from './habitacion/listado-habitacion/listado-habitacion.component';
import { ListadoUsuarioComponent } from './usuario/listado-usuario/listado-usuario.component';
import { FormularioUsuarioComponent } from './usuario/formulario-usuario/formulario-usuario.component';

const MaterialComponents = [
  MatSidenavModule,
  MatToolbarModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatTooltipModule,
  MatTableModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatPaginatorModule
];

@NgModule({
  declarations: [
    ListadoAlojamientoComponent,
    FormularioAlojamientoComponent,
    FormularioHabitacionComponent,
    ListadoHabitacionComponent,
    ListadoUsuarioComponent,
    FormularioUsuarioComponent,
  ],
  imports: [
    CommonModule,
    MaterialComponents,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [MaterialComponents, NgxSpinnerModule],
})
export class ComponentsModule {}
