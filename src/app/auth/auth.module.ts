import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
// import { ReestablecerPasswordComponent } from './reestablecer-password/reestablecer-password.component';

const MaterialComponents = [
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
];

@NgModule({
  declarations: [LoginComponent, 
    // ReestablecerPasswordComponent
  ],
  imports: [CommonModule, MaterialComponents, FormsModule, ReactiveFormsModule],
  exports: [MaterialComponents, LoginComponent],
})
export class AuthModule {}
