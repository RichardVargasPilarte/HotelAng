import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { UsuariosService } from '../../../services/usuarios.service';
import { GruposService } from '../../../services/grupos.service';
import { Usuario } from '../../../Models/usuario.model';
import { Grupos } from '../../../Models/grupo.model';

import { FormularioUsuarioComponent } from '../formulario-usuario/formulario-usuario.component';

import { Router } from '@angular/router';
import { RedirIfFailPipe } from '../../../Pipes/redir-if-fail.pipe';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './listado-usuario.component.html',
  styleUrls: ['./listado-usuario.component.scss'],
})
export class ListadoUsuarioComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public grupos: Grupos[] = [];
  public subs: Subscription[] = [];
  public isLoaded = false;
  private promesas: Promise<any>[] = [];
  sub: Subscription | undefined;
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

  constructor(
    private usuariosServicio: UsuariosService,
    private grupos$: GruposService,
    public dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService
  ) {
    this.promesas.push(
      new Promise<void>((resolve, reject) => {
        const sub = this.usuariosServicio.ObtenerUsuarios().subscribe({
          next: (res) => {
            this.usuarios.push(res);
            (error: any) => console.log(error);
            () => resolve();
          },
        });
      })
    );

    this.promesas.push(
      new Promise<void>((resolve, reject) => {
        const sub = grupos$.ObtenerGrupos().subscribe({
          next: (res) => {
            this.grupos.push(res);
            (error: any) => console.log(error);
            () => resolve();
          },
        });
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
        this.isLoaded = true;
        // this.usuariosServicio.successObten();
        this.CloseDialog();
        this.refUsuarios.subscribe((data) => {
          console.log(data);
          this.usuarios = [];
          // data.forEach(el => {
          //   this.usuarios.push(el);
          // });
          this.usuarios = data;
          this.CloseDialog();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.usuariosServicio.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  eliminarUsuario(id: number): any {
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
        this.usuariosServicio.BorrarUsuario(id).subscribe({
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
      });
    } else {
      const users = this.usuarios.find((d) => d.id === id);
      this.dialog.open(FormularioUsuarioComponent, {
        width: '70%',
        data: { type: tipo, user: users },
      });
    }
  }
}
