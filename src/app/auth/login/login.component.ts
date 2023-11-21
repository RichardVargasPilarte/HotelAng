import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { JwtService } from '../../services/jwt.service';
import { MatDialog } from '@angular/material/dialog';

import { RestablecerContrasenaComponent } from 'src/app/auth/restablecer-contrasena/restablecer-contrasena.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hide = true;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private _JwtService: JwtService,
    private router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    if (this._JwtService.isAuthenticated()) {
      this.router.navigate(['/app/Menu']);
    }
  }

  get Form() {
    return this.loginForm.controls;
  }

  login() {
    this.loading = true;
    this._JwtService
      .login(this.Form['username'].value, this.Form['password'].value)
      .subscribe(
        {
          next: (res) => {
            console.log(res);
            window.location.reload();
            this.loading = false;
          },
          error: (error) => {
            alert(error.error.non_field_errors);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Nombre de usuario o contraseña equivocada, vuelva a intententar lo nuevamente",
              showConfirmButton: false,
              timer: 2500
            });
            this.loading = false;
          }
        }
      );
  }

  openPasswordReset() {
    this.dialog.open(RestablecerContrasenaComponent, {})
  }
}
