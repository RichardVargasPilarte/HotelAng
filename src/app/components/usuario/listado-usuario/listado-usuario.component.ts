import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UsuarioService } from '../../../services/usuario.service';
import { GruposService } from '../../../services/grupos.service';
import { Usuario } from '../../../models/usuario.model';
import { Grupos } from '../../../models/grupo.model';

import { FormularioUsuarioComponent } from '../formulario-usuario/formulario-usuario.component';

import { RedirIfFailPipe } from '../../../pipes/redir-if-fail.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from 'src/app/shared/types/permissions.types'; 
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './listado-usuario.component.html',
  styleUrls: ['./listado-usuario.component.scss'],
})
export class ListadoUsuarioComponent implements OnInit, OnDestroy {
  public usuarios: Usuario[] = [];
  public grupos: Grupos[] = [];
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  private promesas: Promise<any>[] = [];
  public isLoaded = false;
  public dataSource: Usuario[] = [];
  refUsuarios!: Observable<any[]>;
  refGrupos!: Observable<any[]>;
  socket!: WebSocket;
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'username',
    'estado',
    'telefono',
    'groups',
    'actions',
  ];

  roleIds = RoleId
  permissions = new Permission();

  constructor(
    private usuariosServicio: UsuarioService,
    private grupos$: GruposService,
    public dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private jwtService: JwtService
  ) {
    this.promesas.push(
      new Promise<void>((resolve) => {
        const sub = this.usuariosServicio.GetUser().subscribe(
          {
            next: (res) => {
              this.usuarios.push(res);
            },
            error: (error: any) => {
              console.log(error);
              console.log('Hubo un fallo al momento de traer los datos');
            },
            complete: () => {
              resolve();
            }
          }
        );
        this.subs.push(sub);
      })
    );

    this.promesas.push(
      new Promise<void>((resolve, reject) => {
        const sub = grupos$.getGroups().subscribe(
          {
            next: (res) => {
              this.grupos.push(res);
            },
            error: (error: any) => {
              console.log(error),
                console.log('Hubo un fallo al momento de traer los datos');
            },
            complete: () => {
              resolve();
            }
          }
        );
        this.subs.push(sub);
      })
    );
    this.refUsuarios = this.usuariosServicio.getList();
    this.refGrupos = this.grupos$.getList();
  }

  async ngOnInit(): Promise<void> {
    this.SpinnerService.show();
    Promise.all(this.promesas).then(() => {
      if (
        new RedirIfFailPipe().transform(
          'Grupos/Listado',
          this.grupos,
          this.router
        )
      ) {
        this.dataSource = this.usuarios;
        console.log('estas son los usuarios:', this.dataSource);
        this.isLoaded = true;
        this.subs.push();
        this.CloseDialog();
      }
    });
    this.refUsuarios.subscribe((data) => {
      this.usuarios = data;
      this.dataSource = [];
      this.usuarios.forEach((element) => {
        this.dataSource.push(element);
      });
      this.CloseDialog();
    });
  }

  ngOnDestroy(): void {
    this.usuariosServicio.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  deleteUser(id: number): any {
    Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.SpinnerService.show();
        this.usuariosServicio.deleteUser(id).subscribe({
          next: (data) => {
            Swal.fire('Eliminado!', 'El dato ha sido eliminado.', 'success');
            this.SpinnerService.hide();
            console.log('Se elimino el usuario');
            // se debe mandar a llamar al servicio para que se actualice la lista de datos para obtener los datos registrados
            console.log(data);

            (error: any) =>
              console.log(
                'Hubo un fallo al momento de eliminar el dato' + error
              );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        (error: string) =>
          console.log('Hubo un fallo al momento de eliminar el dato' + error);
        Swal.fire(
          'Cancelado',
          'El dato no fue eliminado y esta seguro :)',
          'error'
        );
      }
    });
  }

  CloseDialog(): void {
    this.SpinnerService.hide();
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioUsuarioComponent, {
        data: { type: tipo },
        // width: '40%',
      });
    } else {
      const users = this.usuarios.find((d) => d.id === id);
      this.dialog.open(FormularioUsuarioComponent, {
        // width: '40%',
        data: { type: tipo, user: users },
      });
    }
  }

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }
}
