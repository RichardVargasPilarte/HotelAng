import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { MainService } from './main.service';
import { HttpResponseId } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root'
})
export class ReestablecerPasswordService extends MainService {
  public override resource = 'reestablecerPassword';

  constructor(httpclient: HttpClient) {
    super(httpclient);
  }

  httpIds = HttpResponseId

  Reestablecer(email: string): Observable<any> {
    console.log(email);
    const body = { email };
    return new Observable((observer) => {
      this.create(body).subscribe((response) => {
        if (response.code == this.httpIds.OK) {
          this.realizado();
            observer.next(response);
        } else {
            this.errorObten(response.detail);
        }
      });
    });
  }

  confirmPasswordReset(token: string, newPassword: string) {
    const url = `${this.baseUrl}/api/password/reset/confirm/${token}/`;
    return this.http.post(url, { new_password: newPassword });
  }
  
}
