import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';
import { Reserva } from '../Models/reserva.model';
import { wsModel } from '../Models/webSocket.model';

import { IReservasResponseDto } from '../dtos/Reserva.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root'
})
export class ReservaService extends MainService {
  public override resource = 'reservas';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  listingReservations(): Observable<Reserva> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            let reserva = new Reserva();
            reserva = Object.assign(reserva, el);
            this.list.push(reserva);
            observer.next(reserva);
          });
        } else {
          this.errorObten(response.detail);
        }
        observer.complete();
      });
    });
  }

  async getAsynchronousReservations(): Promise<Array<Reserva>> {
    const response: IReservasResponseDto = await this.getAsync<IReservasResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  AddReservations(reservacion: Reserva): Observable<any> {
    const body = { reservacion };
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

  getAReservation(id: number | string) {
    return this.getByID(id);
  }

  updateReservation(id: string | number, reservaciones: any) {
    const body = { reservaciones };
    return this.update(body, id);
  }

  deleteReserve(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    let reservacion = new Reserva();
    reservacion = Object.assign(reservacion, data.data);

    switch (data.event) {
      case 'c':
        {
          data.data = reservacion;
          this.list.push(reservacion);
          this.list$.next(this.list);
          break;
        }
      case 'u':
        {
          const index = this.list.map((el) => el.id).indexOf(reservacion.id);
          this.list.splice(index, 1, reservacion);
          this.list$.next(this.list);
          break;
        }
      case 'd':
        {
          const list = this.list.filter((el) => el.id !== reservacion.id);
          this.list = list;
          this.list$.next(this.list);
          break;
        }
    }
  }
}
