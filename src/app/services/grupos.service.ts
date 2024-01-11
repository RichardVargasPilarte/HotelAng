import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MainService } from './main.service';

import { Grupos } from '../Models/grupo.model';

@Injectable({
  providedIn: 'root',
})
export class GruposService extends MainService {
  public override resource = 'usuarios/Grupos';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  getGroups(): Observable<Grupos> {
    return new Observable((observer) => {
      this.get().subscribe((data) => {
        if (!data.detail) {
          data.grupos.forEach((el: any) => {
            let grupos = new Grupos();
            grupos = Object.assign(grupos, el);
            this.list.push(grupos);
            observer.next(grupos);
          });
        } else {
          this.errorObten(data.detail);
        }
        observer.complete();
      });
    });
  }
}
