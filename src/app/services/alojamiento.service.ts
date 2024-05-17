import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { Alojamiento } from '../Models/alojamiento.model';
import { wsModel } from '../Models/webSocket.model';

import { MainService } from './main.service';
import { IAlojamientosResponseDto } from '../dtos/Alojamiento.dto';
import { HttpCode } from '../../app/shared/types/httpResponse.types';


@Injectable({
  providedIn: 'root',
})
export class AlojamientoService extends MainService {
  public override resource = 'alojamientos';

  private searchTerms = new Subject<string>();
  private accommodationsCache: Alojamiento[] = [];

  constructor(httpclient: HttpClient) {
    super(httpclient);

    this.getAccommodationsAsynchronous().then(data => {
      this.accommodationsCache = data;
    })
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

  searchAccommodations(term: string): Observable<Alojamiento[]> {
    this.searchTerms.next(term); // Enviar el término de búsqueda
    return this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((searchTerm: string) => this.filterAccommodations(searchTerm)),
      catchError(this.handleError<Alojamiento[]>('searchAccommodations', []))
    );
  }

  private filterAccommodations(term: string): Alojamiento[] {
    return this.accommodationsCache.filter((accommodation: Alojamiento) =>
      accommodation.nombre.toLowerCase().includes(term.toLowerCase())
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
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
