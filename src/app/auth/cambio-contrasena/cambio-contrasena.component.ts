import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { JwtService } from 'src/app/services/jwt.service';

import { ChangePassword } from '../../models/usuario.model';
import JwtCustomInterface from 'src/app/models/jwtInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss']
})
export class CambioContrasenaComponent implements OnInit {
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

    // this.usuarioServicio.changeUserPassword(userPassword.id!, userPassword).subscribe({
    //   next: async (res:any) => {
    //     console.log(userPassword)
    //     console.log(res)

    //     await Swal.fire({
    //       position: "top-end",
    //       icon: "success",
    //       title: "La contrseña a sido cambiada correctamente",
    //       showConfirmButton: false,
    //       timer: 2500
    //     });

    //     this.dialogRef.close();

    //     this.jwtService.logout();
    //   },
    //   error: (error: any) => {
    //     console.error(error);

    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "A ocurrido un error al momento de cambiar la contraseña, vuelva a intententar lo nuevamente",
    //       showConfirmButton: false,
    //       timer: 2500
    //     });
    //   },
    // })

    this.jwtService.logout()
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
