import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';

import { UsuarioService } from '../../../services/usuario.service';
import { CreateUser, IUsuario, Usuario } from '../../../Models/usuario.model';
import { GruposService } from '../../../services/grupos.service';
import { Grupos } from '../../../Models/grupo.model';


interface DialogData {
  type: string;
  user?: Usuario;
}

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.scss'],
})
export class FormularioUsuarioComponent implements OnInit, OnDestroy {
  public usuarios: Usuario = new Usuario();
  public gruposCargados: Grupos[] = [];
  subs: Subscription[] = [];
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
  }

  ngOnInit(): void {
    this.subs.push(
      this.refGrupos.subscribe((groups_name) => (this.gruposCargados = groups_name))
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
      const usuarioData: IUsuario = this.data.user as IUsuario;
      const userGroups = usuarioData.groups as any[];

      this.form = this.fb.group({
        id: usuarioData.id,
        first_name: new FormControl(usuarioData.first_name, [
          Validators.required,
          Validators.minLength(3),
        ]),
        last_name: new FormControl(usuarioData.last_name, [
          Validators.required,
          Validators.minLength(3),
        ]),
        password: new FormControl(usuarioData.password || null,
          Validators.minLength(8)),
        username: new FormControl(usuarioData.username, [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new FormControl(
          usuarioData.email,
          Validators.required
        ),
        direccion: new FormControl(usuarioData.direccion, [
          Validators.required,
          Validators.minLength(10),
        ]),
        // groups: new FormControl(
        //   userGroups && userGroups.length > 0 ? userGroups[0].id : null,
        //   Validators.required
        // ),
        groups: new FormControl(
          userGroups && userGroups.length > 0 ? userGroups.find(group => true)?.id : null,
          Validators.required
        ),
        estado: new FormControl(
          usuarioData.estado,
          Validators.required
        ),
        telefono: new FormControl(
          usuarioData.telefono,
          Validators.required
        ),
        confirmPassword: new FormControl('',
          Validators.minLength(8),
        ),
      });
      this.gruposCargados = userGroups;
    }
  }

  saveUser(): void {
    let user = new CreateUser();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.addUsers(user).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error: unknown) => console.error(error),
      })
    );
  }

  updateUser(): void {
    let user = new Usuario();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.updateUser(user.id!, user).subscribe({
        next: () => {
          this.dialogRef.close();
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
