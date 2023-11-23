import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { ListadoAlojamientoComponent } from './alojamiento/listado-alojamiento/listado-alojamiento.component';
import { FormularioAlojamientoComponent } from './alojamiento/formulario-alojamiento/formulario-alojamiento.component';
import { FormularioHabitacionComponent } from './habitacion/formulario-habitacion/formulario-habitacion.component';
import { ListadoHabitacionComponent } from './habitacion/listado-habitacion/listado-habitacion.component';
import { ListadoUsuarioComponent } from './usuario/listado-usuario/listado-usuario.component';
import { FormularioUsuarioComponent } from './usuario/formulario-usuario/formulario-usuario.component';
import { ListadoClienteComponent } from './cliente/listado-cliente/listado-cliente.component';
import { FormularioClienteComponent } from './cliente/formulario-cliente/formulario-cliente.component';
import { FormularioReservaComponent } from './reserva/formulario-reserva/formulario-reserva.component';
import { ListadoReservaComponent } from './reserva/listado-reserva/listado-reserva.component';
import { SharedModule } from '../shared/shared.module';

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
  MatPaginatorModule,
  MatDatepickerModule
];

@NgModule({
  declarations: [
    ListadoAlojamientoComponent,
    FormularioAlojamientoComponent,
    FormularioHabitacionComponent,
    ListadoHabitacionComponent,
    ListadoUsuarioComponent,
    FormularioUsuarioComponent,
    ListadoClienteComponent,
    FormularioClienteComponent,
    FormularioReservaComponent,
    ListadoReservaComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialComponents,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatMomentDateModule
  ],
  exports: [MaterialComponents, NgxSpinnerModule],
})
export class ComponentsModule {}
