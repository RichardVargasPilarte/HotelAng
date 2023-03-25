import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';
import { Reserva } from '../Models/reserva.model';
import { wsModel } from '../Models/webSocket.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService extends MainService {
  public override resource = 'reservas';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  ListadoReservas(): Observable<Reserva> {
    return new Observable((observer) => {
      this.get().subscribe((data) => {
        if (!data.detail ) {
          data.reservacion.forEach((el: any) => {
            // console.log(el)
            let reserva = new Reserva();
            reserva = Object.assign(reserva, el);
            this.list.push(reserva);
            observer.next(reserva);
          });
        } else {
          this.errorObten(data.detail);
        }
        observer.complete();
      });
    });
  }

  Agregar(reservacion: Reserva): Observable<any> {
    console.log(reservacion);
    const body = { reservacion };
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

  ObtenerUnaReserva(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  ActualizarReserva(id: string | number, reservaciones: any) {
    const body = { reservaciones };
    return this.update(body, id);
  }

  BorrarRerserva(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    console.log(data);
    let reservacion = new Reserva();
    reservacion = Object.assign(reservacion, data.data);

    switch (data.event) {
      case 'c':
        console.log('Crear');
        data.data = reservacion;
        this.list.push(reservacion);
        this.list$.next(this.list);
        break;
      case 'u':
        console.log('update');
        const index = this.list.map((el) => el.id).indexOf(reservacion.id);
        this.list.splice(index, 1, reservacion);
        this.list$.next(this.list);
        break;
      case 'd':
        console.log('delete');
        const list = this.list.filter((el) => el.id !== reservacion.id);
        console.log(list);
        this.list = list;
        this.list$.next(this.list);
        break;
    }
  }
}
