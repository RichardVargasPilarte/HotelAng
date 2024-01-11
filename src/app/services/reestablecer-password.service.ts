import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SendEmail } from '../Models/usuario.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReestablecerPasswordService {

  constructor(private http: HttpClient) { }

  base_url = 'http://127.0.0.1:8000/api/password_reset/';
  resetPasswordUrl = `http://localhost:8000/api/password_reset/confirm/?token`

  sendEmailPassword(email:SendEmail): Observable<object> {
    const url = this.base_url;
    return this.http.post(url, email );
  }

  resetPassword(token: string, password: string ): Observable<any> {
    const resetData = { token, password };
    const apiUrl = `${this.resetPasswordUrl}`;
    return this.http.post(apiUrl, resetData);
  }
}



