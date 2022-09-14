import { Component, OnInit, Inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';

import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../Models/usuario.model';
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
export class FormularioUsuarioComponent implements OnInit {
  public usuarios: Usuario = new Usuario();
  public gruposCargados: Grupos[] = [];
  public edit: boolean | undefined;
  subs: Subscription[] = [];
  public selected? = '0';
  public form!: UntypedFormGroup;
  public refGrupos: Observable<any>;

  activo!: [{ id: 1; name: 'SI' }, { id: 2; name: 'NO' }];

  constructor(
    private fb: UntypedFormBuilder,
    private usuarioServicio: UsuariosService,
    private grupoServicio: GruposService,
    public dialogRef: MatDialogRef<FormularioUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.gruposCargados = this.grupoServicio.list;
    this.refGrupos = this.grupoServicio.getList();
    this.selected = this.gruposCargados[0].id;
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

  createForm() {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new UntypedFormControl(0),
        first_name: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        last_name: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        username: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new UntypedFormControl('', Validators.required),
        direccion: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        tipo_usuario: new UntypedFormControl('', Validators.required),
        estado: new UntypedFormControl('', Validators.required),
        telefono: new UntypedFormControl('', Validators.required),
        eliminado: new UntypedFormControl('NO'),
      });
    } else {
      this.form = this.fb.group({
        id: this.data.user!.id,
        first_name: new UntypedFormControl(this.data.user!.first_name, [
          Validators.required,
          Validators.minLength(5),
        ]),
        last_name: new UntypedFormControl(this.data.user!.last_name, [
          Validators.required,
          Validators.minLength(8),
        ]),
        password: new UntypedFormControl(this.data.user!.password, [
          Validators.required,
          Validators.minLength(8),
        ]),
        username: new UntypedFormControl(this.data.user!.username, [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new UntypedFormControl(
          this.data.user!.email,
          Validators.required
        ),
        direccion: new UntypedFormControl(this.data.user!.direccion, [
          Validators.required,
          Validators.minLength(10),
        ]),
        tipo_usuario: new UntypedFormControl(
          this.data.user!.tipo_usuario,
          Validators.required
        ),
        estado: new UntypedFormControl(
          this.data.user!.estado,
          Validators.required
        ),
        telefono: new UntypedFormControl(
          this.data.user!.telefono,
          Validators.required
        ),
      });
    }
  }

  saveUsuario(): void {
    let user = new Usuario();
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

  updateUsuario(): void {
    let user = new Usuario();
    user = Object.assign(user, this.form.value);
    this.subs.push(
      this.usuarioServicio.ActualizarUsuario(user.id!, user).subscribe({
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
}
