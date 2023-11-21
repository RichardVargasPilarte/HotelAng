import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';
import { CreateUser, Usuario } from '../models/usuario.model';
import { wsModel } from '../models/webSocket.model';

import { IUsuariosResponseDto } from '../dtos/Usuario.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends MainService {
  public override resource = 'usuarios';

  constructor(private httpclient: HttpClient,) {
    super(httpclient);
  }

  // Metodo GET - Listar todos los usuarios
  GetUser(): Observable<any> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            // console.log(el)
            let usuario = new Usuario();
            usuario = Object.assign(usuario, el);
            this.list.push(usuario);
            observer.next(usuario);
          });
        } else {
          this.errorObten(response.detail);
        }
        observer.complete();
      });
    });
  }

  async getAsynchronousUsers(): Promise<Array<Usuario>> {
    const response: IUsuariosResponseDto = await this.getAsync<IUsuariosResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  // Metodo POST - addUsers un nuevo usuario
  addUsers(usuario: CreateUser): Observable<object> {
    const body = { usuario };
    return new Observable((observer) => {
      this.create(body).subscribe((response) => {
        if (response.code == HttpCode.Created) {
          this.realizado();
          observer.next(response);
        } else {
          this.errorObten(response.detail);
        }
      });
    });
  }

  // Metodo GET - Para obtener un solo dato mediante su Id
  getAUser(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  updateUser(id: string | number, usuario: any) {
    const body = { usuario };
    return this.update(body, id);
  }

  changeUserPassword(id: string | number, userPassword: any) {
    const base_url = 'http://127.0.0.1:8000/api/usuarios';
    const url = `${base_url}/CambiarContrasena/${id}`
    return this.httpclient.put(url, userPassword);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  deleteUser(id: string | number) {
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
