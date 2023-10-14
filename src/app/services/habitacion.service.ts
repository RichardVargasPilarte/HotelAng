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



  // Metodo GET - Listar todos las habitaciones
  ListadoHabitaciones(): Observable<Habitacion> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            // console.log(el)
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

  async getHabitaciones(): Promise<Array<Habitacion>> {
    const response: IHabitacionesResponseDto = await this.getAsync<IHabitacionesResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  // Metodo POST - Agregar una nueva habitacion
  Agregar(habitacion: Habitacion): Observable<any> {
    console.log(habitacion);
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

  // Metodo GET - Para obtener un solo dato mediante su Id
  ObtenerUnaHabitacion(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  ActualizarHabitacion(id: string | number, habitaciones: any) {
    const body = { habitaciones };
    return this.update(body, id);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  BorrarHabitacion(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    console.log(data);
    let habitacion = new Habitacion();
    habitacion = Object.assign(habitacion, data.data);

    switch (data.event) {
      case 'c':
        console.log('Crear');
        data.data = habitacion;
        this.list.push(habitacion);
        this.list$.next(this.list);
        break;
      case 'u':
        console.log('update');
        const index = this.list.map((el) => el.id).indexOf(habitacion.id);
        this.list.splice(index, 1, habitacion);
        this.list$.next(this.list);
        break;
      case 'd':
        console.log('delete');
        const list = this.list.filter((el) => el.id !== habitacion.id);
        console.log(list);
        this.list = list;
        this.list$.next(this.list);
        break;
    }
  }
}
