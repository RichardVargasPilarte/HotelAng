import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/cliente.model';
import { wsModel } from '../models/webSocket.model';

import { MainService } from './main.service';
import { IClientesResponseDto } from '../dtos/Cliente.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends MainService {
  public override resource = 'clientes';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  // Metodo GET - Listar todos los clientes
  getCustomers(): Observable<Cliente> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            // console.log(el)
            let cliente = new Cliente();
            cliente = Object.assign(cliente, el);
            this.list.push(cliente);
            observer.next(cliente);
          });
        } else {
          this.errorObten(response.detail);
        }
        observer.complete();
      });
    });
  }

  // Metodo GET - Listar todos los clientes de manera asincrona desde el inicio
  async getClientsAsynchronous(): Promise<Array<Cliente>> {
    const response: IClientesResponseDto = await this.getAsync<IClientesResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    console.log(this.list)
    return response.data
  }

  // Metodo POST - Agregar un nuevo cliente
  addCustomer(cliente: Cliente): Observable<any> {
    console.log(cliente);
    const body = { cliente };
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
  getACustomer(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  updateClient(id: string | number, clientes: Cliente) {
    const body = { clientes };
    return this.update(body, id);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  deleteClient(id: number | string) {
    return this.delete(id);
  }

  override updateList(socketEvent: wsModel) {
    // console.log(data)
    let cliente = new Cliente();
    cliente = Object.assign(cliente, socketEvent.data);
    console.log(socketEvent);
    switch (socketEvent.event) {
      case 'c':
        // console.log("Crear")
        socketEvent.data = cliente;
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
