import { Component, OnInit, Inject } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { JwtService } from 'src/app/services/jwt.service';

import { ChangePassword, Usuario } from '../../models/usuario.model';
import JwtCustomInterface from 'src/app/models/jwtInterface';
import Swal from 'sweetalert2';

interface DialogData {
  type: string;
  user?: Usuario;
}
@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss']
})
export class CambioContrasenaComponent implements OnInit {
  subs: Subscription[] = [];
  public form!: FormGroup;



  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioService,
    public dialogRef: MatDialogRef<CambioContrasenaComponent>,
    public jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(id?: string): void {

    const user = this.jwtService.getDecodedToken() as JwtCustomInterface;
    this.form = this.fb.group({
      id: new FormControl(user.user_id),
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ])
    },
      {
        validators: this.MustMatch('new_password', 'confirmPassword')
      });
  }

  changePassword(): void {
    let userPassword = new ChangePassword();
    userPassword = Object.assign(userPassword, this.form.value);
    this.subs.push(
      this.usuarioServicio.changeUserPassword(userPassword.id!, userPassword).subscribe({
        next: (res) => {
          console.log(userPassword)
          console.log(res)

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "La contrseña a sido cambiada correctamente",
            showConfirmButton: false,
            timer: 2500
          });

          this.dialogRef.close();
        },
        error: (error: any) => {
          console.error(error);

          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "A ocurrido un error al momento de cambiar la contraseña, vuelva a intententar lo nuevamente",
            showConfirmButton: false,
            timer: 2500
          });
        },
      })
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

}