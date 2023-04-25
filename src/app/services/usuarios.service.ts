import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';
import { Usuario } from '../models/usuario.model';
import { wsModel } from '../models/webSocket.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService extends MainService {
  public override resource = 'usuarios';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  // Metodo GET - Listar todos los usuarios
  ObtenerUsuarios(): Observable<any> {
    return new Observable((observer) => {
      this.get().subscribe((data) => {
        if (!data.detail) {
          data.usuario.forEach((el: any) => {
            // console.log(el)
            let usuario = new Usuario();
            usuario = Object.assign(usuario, el);
            this.list.push(usuario);
            observer.next(usuario);
          });
        } else {
          this.errorObten(data.detail);
        }
        observer.complete();
      });
    });
  }

  // Metodo POST - Agregar un nuevo usuario
  Agregar(usuario: Usuario): Observable<object> {
    const body = { usuario };
    return new Observable((observer) => {
      this.create(body).subscribe((response) => {
        if (!response.detail) {
          this.realizado();
          observer.next(response);
        } else {
          this.errorObten(response.detail);
        }
      });
    });
  }

  // Metodo GET - Para obtener un solo dato mediante su Id
  ObtenerUnUsuario(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  ActualizarUsuario(id: string | number, usuario: any) {
    const body = { usuario };
    return this.update(body, id);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  BorrarUsuario(id: string | number) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    // console.log(data)
    let usuario = new Usuario();
    usuario = Object.assign(usuario, data.data);

    switch (data.event) {
      case 'c':
        // console.log("Crear")
        data.data = usuario;
        this.list.push(usuario);
        this.list$.next(this.list);
        break;
      case 'u':
        //  console.log("update")
        const index = this.list.map((el) => el.id).indexOf(usuario.id);
        this.list.splice(index, 1, usuario);
        this.list$.next(this.list);
        break;
      case 'd':
        // console.log("delete")
        const list = this.list.filter((el) => el.id !== usuario.id);
        console.log(list);
        this.list = list;
        this.list$.next(this.list);
        break;
    }
  }
}
