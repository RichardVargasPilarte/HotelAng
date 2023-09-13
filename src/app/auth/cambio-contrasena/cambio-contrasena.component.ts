import { Component, OnInit, Inject } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';

import { CreateUser, Usuario  } from '../../models/usuario.model';

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ])
      },
        {
          validators: this.MustMatch('password', 'confirmPassword')
        });
    }
  }
  saveUsuario(): void {
    let user = new CreateUser();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.Agregar(user).subscribe({
        next: (res) => {
          this.dialogRef.close();
          console.log(res);
        },
        error: (error: any) => console.error(error),
      })
    );
  }
  changePassword(): void {
    let user = new Usuario();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.cambiarContraseña(user.id!, user).subscribe({
        next: (res) => {
          this.dialogRef.close();
          console.log(res);
        },
        error: (error: any) => console.error(error),
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
