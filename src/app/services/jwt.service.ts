import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { CookieService } from 'ngx-cookie-service';
import JwtCustomInterface from '../models/jwtInterface';
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
    // this.cookie.delete('access','/');
    this.cookie.deleteAll('');
    window.location.reload();
  }

  public get loggedIn(): boolean {
    return this.cookie.get('access') !== null;
  }

  getDecodedToken() {
    const token = this.cookie.get('access');
    if (!token) return false;
    const decoded = jwtDecode<JwtCustomInterface>(token);
    return decoded;
  }

  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    const decoded = this.getDecodedToken();
    if (decoded) {
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

  getUserRoles() {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return []
    const groups = decodedToken.groups;
    return groups;
  }

  userhaveRole(role: string) {
    const decoded = this.getDecodedToken() as JwtCustomInterface;
    if (decoded?.user_id === 1) return true;
    const userGrups = this.getUserRoles()
    return userGrups.includes(role)
  }

}