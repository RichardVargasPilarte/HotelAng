import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subscription, Observable } from 'rxjs';

import { UsuarioService } from '../../../services/usuario.service';
import { CreateUser, Usuario } from '../../../models/usuario.model';
import { GruposService } from '../../../services/grupos.service';
import { Grupos } from '../../../models/grupo.model';

interface DialogData {
  type: string;
  user?: Usuario;
}

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.scss'],
})
export class FormularioUsuarioComponent implements OnInit {
  public usuarios: Usuario = new Usuario();
  public gruposCargados: Grupos[] = [];
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected = '';
  public form!: FormGroup;
  public refGrupos: Observable<any>;

  activo!: [{ id: 1; name: 'SI' }, { id: 2; name: 'NO' }];

  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioService,
    private grupoServicio: GruposService,
    public dialogRef: MatDialogRef<FormularioUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.gruposCargados = this.grupoServicio.list;
    this.refGrupos = this.grupoServicio.getList();
    // this.selected = this.gruposCargados[0].id;
  }

  ngOnInit(): void {
    this.subs.push(
      this.refGrupos.subscribe((groups) => (this.gruposCargados = groups))
    );
    this.createForm();
  }

  ngOnDestroy() {
    this.gruposCargados = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(0),
        first_name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        last_name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        direccion: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        groups: new FormControl('', Validators.required),
        estado: new FormControl('Activo', Validators.required),
        telefono: new FormControl('', Validators.required),
        eliminado: new FormControl('NO'),
      },
        {
          validators: this.MustMatch('password', 'confirmPassword')
        });
    } else {
      this.form = this.fb.group({
        id: this.data.user!.id,
        first_name: new FormControl(this.data.user!.first_name, [
          Validators.required,
          Validators.minLength(3),
        ]),
        last_name: new FormControl(this.data.user!.last_name, [
          Validators.required,
          Validators.minLength(3),
        ]),
        password: new FormControl(this.data.user!.password, [
          Validators.required,
          Validators.minLength(8),
        ]),
        username: new FormControl(this.data.user!.username, [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new FormControl(
          this.data.user!.email,
          Validators.required
        ),
        direccion: new FormControl(this.data.user!.direccion, [
          Validators.required,
          Validators.minLength(10),
        ]),
        groups: new FormControl(
          this.data?.user?.groups,
          Validators.required
        ),
        estado: new FormControl(
          this.data.user!.estado,
          Validators.required
        ),
        telefono: new FormControl(
          this.data.user!.telefono,
          Validators.required
        ),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      });
    }
  }

  saveUser(): void {
    let user = new CreateUser();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.addUsers(user).subscribe({
        next: (res) => {
          this.dialogRef.close();
          console.log(res);
        },
        error: (error: any) => console.error(error),
      })
    );
  }

  updateUser(): void {
    let user = new Usuario();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.updateUser(user.id!, user).subscribe({
        next: (res) => {
          this.dialogRef.close();
          console.log(res);
        },
        error: (error: any) => console.error(error),
      })
    );
  }

  get Form(): any {
    return this.form.controls;
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
