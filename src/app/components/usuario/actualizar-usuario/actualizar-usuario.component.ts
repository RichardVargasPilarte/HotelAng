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
import { Usuario, IUserUpdate, UserUpdate } from '../../../Models/usuario.model';
import { GruposService } from '../../../services/grupos.service';
import { Grupos } from '../../../Models/grupo.model';

interface DialogData {
  type: string;
  user?: UserUpdate | IUserUpdate;
}

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss']
})
export class ActualizarUsuarioComponent implements OnInit, OnDestroy {
  public usuarios: Usuario = new Usuario();
  public gruposCargados: Grupos[] = [];
  subs: Subscription[] = [];
  public form!: FormGroup;
  public refGrupos: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioService,
    private grupoServicio: GruposService,
    public dialogRef: MatDialogRef<ActualizarUsuarioComponent>,
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
    if (this.data.type === 'u') {

      const usuarioData: IUserUpdate = this.data.user as IUserUpdate;
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
        groups: new FormControl(
          userGroups && userGroups.length > 0 ? userGroups.find(group => true)?.id : null,
          Validators.required
        ),
        telefono: new FormControl(
          usuarioData.telefono,
          Validators.required
        ),
        eliminado: new FormControl('NO'),
      });
      this.gruposCargados = userGroups;
    }
  }

  updateUser(): void {

    let user = new UserUpdate();
    user = Object.assign(user, this.form.value);
    console.log('Datos del usuario actualizado:', user);
    this.subs.push(
      this.usuarioServicio.updateUser(user.id, user).subscribe({
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
}
