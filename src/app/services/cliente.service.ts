import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../Models/cliente.model';
import { wsModel } from '../Models/webSocket.model';

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

  getCustomers(): Observable<Cliente> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
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

  async getClientsAsynchronous(): Promise<Array<Cliente>> {
    const response: IClientesResponseDto = await this.getAsync<IClientesResponseDto>()
    this.list = response.data
    this.list$.next(this.list)
    return response.data
  }

  addCustomer(cliente: Cliente): Observable<any> {
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

  getACustomer(id: number | string) {
    return this.getByID(id);
  }

  updateClient(id: string | number, clientes: Cliente) {
    const body = { clientes };
    return this.update(body, id);
  }

  deleteClient(id: number | string) {
    return this.delete(id);
  }

  override updateList(socketEvent: wsModel) {
    let cliente = new Cliente();
    cliente = Object.assign(cliente, socketEvent.data);
    switch (socketEvent.event) {
      case 'c': {
        socketEvent.data = cliente;
        this.list.push(cliente);
        this.list$.next(this.list);
        break;
      }
      case 'u':
        {
          const index = this.list.map((el) => el.id).indexOf(cliente.id);
          this.list.splice(index, 1, cliente);
          this.list$.next(this.list);
          break;
        }
      case 'd':
        {
          const list = this.list.filter((el) => el.id !== cliente.id);
          this.list = list;
          this.list$.next(this.list);
          break;
        }
    }
  }
}
