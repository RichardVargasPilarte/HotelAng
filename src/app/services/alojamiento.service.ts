import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Alojamiento } from '../models/alojamiento.model';
import { wsModel } from '../models/webSocket.model';

import { MainService } from './main.service';
import { IAlojamientosResponseDto } from '../dtos/Alojamiento.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root',
})
export class AlojamientoService extends MainService {
  public override resource = 'alojamientos';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  GetAccommodations(): Observable<Alojamiento> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            let alojamiento = new Alojamiento();
            alojamiento = Object.assign(alojamiento, el);
            this.list.push(alojamiento);
            observer.next(alojamiento);
          });
        } else {
          this.errorObten(response.detail);
        }
        observer.complete();
      });
    });
  }

  async getAccommodationsAsynchronous(): Promise<Array<Alojamiento>> {
    const response: IAlojamientosResponseDto = await this.getAsync<IAlojamientosResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  addAccommodations(alojamiento: Alojamiento): Observable<any> {
    const body = { alojamiento };
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

  getAnAccommodation(id: number | string) {
    return this.getByID(id);
  }

  updateAccommodation(id: string | number, alojamientos: Alojamiento) {
    const body = { alojamientos };
    return this.update(body, id);
  }

  deleteAccommodation(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    let alojamiento = new Alojamiento();
    alojamiento = Object.assign(alojamiento, data.data);
    switch (data.event) {
      case 'c':
        {
          data.data = alojamiento;
          this.list.push(alojamiento);
          this.list$.next(this.list);
          break;
        }
      case 'u': {
        const index = this.list.map((el) => el.id).indexOf(alojamiento.id);
        this.list.splice(index, 1, alojamiento);
        this.list$.next(this.list);
        break;
      }
      case 'd': {
        const list = this.list.filter((el) => el.id !== alojamiento.id);
        this.list = list;
        this.list$.next(this.list);
        break;
      }
    }
  }
}
