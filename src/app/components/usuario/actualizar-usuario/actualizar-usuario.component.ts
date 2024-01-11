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
import { ActualizarUsuario } from 'src/app/Models/usuario.model';
import { GruposService } from '../../../services/grupos.service';
import { Grupos } from 'src/app/Models/grupo.model';

interface DialogData {
  type: string;
  user?: ActualizarUsuario;
}

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss']
})
export class ActualizarUsuarioComponent implements OnInit, OnDestroy {

  public usuarios: ActualizarUsuario = new ActualizarUsuario();
  public gruposCargados: Grupos[] = [];
  subs: Subscription[] = [];
  public form!: FormGroup;
  public refGrupos: Observable<any>;

  activo!: [{ id: 1; name: 'SI' }, { id: 2; name: 'NO' }];

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
      this.refGrupos.subscribe((groups) => (this.gruposCargados = groups))
    );
    this.createForm();
  }

  ngOnDestroy() {
    this.gruposCargados = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  createForm(id?: string): void {
    this.form = this.fb.group({
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
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
      telefono: new FormControl('', Validators.required)
    });
  }

  updateUser(): void {
    let user = new ActualizarUsuario();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.updateUser(user.id!, user).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error: unknown) => console.error(error),
      })
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
