import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { HttpCode } from '../../app/shared/types/httpResponse.types';

@Injectable({
  providedIn: 'root'
})
export class ReestablecerPasswordService {

  constructor(private http: HttpClient) { }

  base_url = 'http://localhost:8000/api/password_reset/';

  initiatePasswordReset(email: string) {
    const url = this.base_url;
    return this.http.post(url, { email });
  }
  
  restaurarContraseña(token: string, newPassword: string): Observable<any> {
    const apiUrl = this.base_url;
    const resetData = { token, newPassword };
    return this.http.post(apiUrl, resetData);
  }

  sendEmailPassword(email:string) {
    const url = this.base_url;
    return this.http.post(url, { email });
  }
}



