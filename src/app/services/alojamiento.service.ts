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

  // Metodo GET - Listar todos los alojamientos
  GetAccommodations(): Observable<Alojamiento> {
    return new Observable((observer) => {
      this.get().subscribe((response) => {
        // if (response.code == 200) {
        if (response.code == HttpCode.OK) {
          response.data.forEach((el: any) => {
            // console.log(el)
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

  // Metodo GET - Listar todos los alojamientos de manera asincrona desde el inicio
  async getAccommodationsAsynchronous(): Promise<Array<Alojamiento>> {
    const response: IAlojamientosResponseDto = await this.getAsync<IAlojamientosResponseDto>()
    this.list = response.data
    this.list$.next(this.list);
    return response.data
  }

  // Metodo POST - addAccommodations un nuevo alojamiento
  addAccommodations(alojamiento: Alojamiento): Observable<any> {
    console.log(alojamiento);
    const body = { alojamiento };
    return new Observable((observer) => {
      this.create(body).subscribe((response) => {
        // if (response.code == 201) {
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
  getAnAccommodation(id: number | string) {
    console.log(id);
    return this.getByID(id);
  }

  // Metodo PUT - Para actualizar un dato mediante su Id
  updateAccommodation(id: string | number, alojamientos: Alojamiento) {
    const body = { alojamientos };
    return this.update(body, id);
  }

  // Metodo DELETE - Para eliminar un dato mediante su Id
  deleteAccommodation(id: number | string) {
    return this.delete(id);
  }

  override updateList(data: wsModel) {
    // console.log(data)
    let alojamiento = new Alojamiento();
    alojamiento = Object.assign(alojamiento, data.data);
    console.log(data);
    switch (data.event) {
      case 'c':
        // console.log("Crear")
        data.data = alojamiento;
        this.list.push(alojamiento);
        this.list$.next(this.list);
        break;
      case 'u':
        //  console.log("update")
        const index = this.list.map((el) => el.id).indexOf(alojamiento.id);
        this.list.splice(index, 1, alojamiento);
        this.list$.next(this.list);
        break;
      case 'd':
        // console.log("delete")
        const list = this.list.filter((el) => el.id !== alojamiento.id);
        console.log(list);
        this.list = list;
        this.list$.next(this.list);
        break;
    }
  }
}
