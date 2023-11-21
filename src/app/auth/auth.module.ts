import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import { CambioContrasenaComponent } from './cambio-contrasena/cambio-contrasena.component';
import { CambiarContrasenaOlvidadaComponent } from './cambiar-contrasena-olvidada/cambiar-contrasena-olvidada.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RestablecerContrasenaComponent } from './restablecer-contrasena/restablecer-contrasena.component';

const MaterialComponents = [
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatToolbarModule,
  MatSidenavModule
];

@NgModule({
  declarations: [LoginComponent, CambioContrasenaComponent,
    CambiarContrasenaOlvidadaComponent,
    RestablecerContrasenaComponent
  ],
  imports: [CommonModule, RouterModule, MaterialComponents, FormsModule, ReactiveFormsModule],
  exports: [MaterialComponents, LoginComponent],
})
export class AuthModule {}
