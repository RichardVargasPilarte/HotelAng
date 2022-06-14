import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    private httpClient: HttpClient,
    private cookie: CookieService
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<any>(environment.API_Auth, { username, password }).pipe(tap(res => {
      console.log(res);
      alert(res);
      this.cookie.set('access', String(res.access));
    }));
  }

  logout() {
    this.cookie.delete('access');
  }

  public get loggedIn(): boolean {
    return this.cookie.get('access') !== null;
  }

  public isAuthenticated(): boolean {
    const token = this.cookie.get('access');
    // Check whether the token is expired and return
    // true or false
    if (token){
      const decoded = jwtDecode<JwtPayload>(token);
      // console.log(decoded);
      if (decoded.exp === undefined) {
        console.log('No exp');
        return false;
      }
      if (decoded.exp < Date.now() / 1000) {
        console.log('token expirado');
        return false;
      }
      return true;
    }
    return false;
  }

  public get Token(): string {
    return this.cookie.get('access');
  }

  tokenVerify(): Observable<any> {
    const body = { token: this.Token };
    const head = {} as any;
    head['Content-Type'] = 'application/json';
    return this.httpClient.post(environment.Api_Auth_Verify, body, head);
  }
}
