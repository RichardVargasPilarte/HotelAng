import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';
import { Habitacion } from '../models/habitacion.model';
import { wsModel } from '../models/webSocket.model';

import { IHabitacionesResponseDto } from '../dtos/Habitacion.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService extends MainService {
  public override resource = 'habitaciones';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  listingRooms(): Observable<Habitacion> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            let habitacion = new Habitacion();
            habitacion = Object.assign(habitacion, el);
            this.list.push(habitacion);
            observer.next(habitacion);
          });
        } else {
          this.errorObten(response.detail);
        }
        observer.complete();
      });
    });
  }

  async getRoomsAsynchronous(): Promise<Array<Habitacion>> {
    const response: IHabitacionesResponseDto = await this.getAsync<IHabitacionesResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  addRoom(habitacion: Habitacion): Observable<any> {
    const body = { habitacion };
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

  getARoom(id: number | string) {
    return this.getByID(id);
  }

  UpdateRoom(id: string | number, habitaciones: any) {
    const body = { habitaciones };
    return this.update(body, id);
  }

  deleteRoom(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    let habitacion = new Habitacion();
    habitacion = Object.assign(habitacion, data.data);

    switch (data.event) {
      case 'c':
        {
          data.data = habitacion;
          this.list.push(habitacion);
          this.list$.next(this.list);
          break;
        }
      case 'u':
        {
          const index = this.list.map((el) => el.id).indexOf(habitacion.id);
          this.list.splice(index, 1, habitacion);
          this.list$.next(this.list);
          break;
        }
      case 'd':
        {
          const list = this.list.filter((el) => el.id !== habitacion.id);
          this.list = list;
          this.list$.next(this.list);
          break;
        }
    }
  }
}
