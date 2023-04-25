import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/cliente.model';
import { wsModel } from '../models/webSocket.model';

import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends MainService {
  public override resource = 'clientes';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  // Metodo GET - Listar todos los clientes
  ObtenerClientes(): Observable<Cliente> {
    return new Observable((observer) => {
      this.get().subscribe((data) => {
        if (!data.detail) {
          data.cliente.forEach((el: any) => {
            // console.log(el)
            let cliente = new Cliente();
            cliente = Object.assign(cliente, el);
            this.list.push(cliente);
            observer.next(cliente);
          });
        } else {
          this.errorObten(data.detail);
        }
        observer.complete();
      });
    });
  }

  // Metodo POST - Agregar un nuevo cliente
  Agregar(cliente: Cliente): Observable<any> {
    console.log(cliente);
    const body = { cliente };
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
  ObtenerUnCliente(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  ActualizarCliente(id: string | number, clientes: Cliente) {
    const body = { clientes };
    return this.update(body, id);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  BorrarCliente(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    // console.log(data)
    let cliente = new Cliente();
    cliente = Object.assign(cliente, data.data);
    console.log(data);
    switch (data.event) {
      case 'c':
        // console.log("Crear")
        data.data = cliente;
        this.list.push(cliente);
        this.list$.next(this.list);
        break;
      case 'u':
        //  console.log("update")
        const index = this.list.map((el) => el.id).indexOf(cliente.id);
        this.list.splice(index, 1, cliente);
        this.list$.next(this.list);
        break;
      case 'd':
        // console.log("delete")
        const list = this.list.filter((el) => el.id !== cliente.id);
        console.log(list);
        this.list = list;
        this.list$.next(this.list);
        break;
    }
  }
}
