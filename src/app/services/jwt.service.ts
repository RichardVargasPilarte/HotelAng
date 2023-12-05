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

  saveLocalStorage(token: string) {
    localStorage.setItem('access', token);
  }

  login(username: string, password: string) {
    return this.httpClient.post<any>(environment.API_Auth, { username, password }).pipe(tap(res => {
      console.log(res);
      alert(res);
      // this.cookie.set('access', String(res.access));
      this.saveLocalStorage(res.access);
    }));
  }

  logout() {
    alert('logout');
    // this.deleteAllCookies();
    localStorage.removeItem('access');
    window.location.reload();
    // wait 5 sec to refresh
    // setTimeout(() => window.location.reload(), 5000);
  }

  public get loggedIn(): boolean {
    // return !!this.cookie.get('access')
    return !!localStorage.getItem('access')
  }

  getDecodedToken() {
    // const token = this.cookie.get('access');
    const token = localStorage.getItem('access');
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
    // return this.cookie.get('access');
    return localStorage.getItem('access') || '';
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

  // userhaveRole(role: string) {
  //   const decoded = this.getDecodedToken() as JwtCustomInterface;
  //   if (decoded?.user_id === 1) return true;
  //   const userGrups = this.getUserRoles()
  //   return userGrups.includes(role)
  // }

  getUserPermissions() {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return []
    const groups = decodedToken.permissions;
    return groups;
  }

  hasRole(roleId: number) {
    const decoded = this.getDecodedToken() as JwtCustomInterface;
    if (decoded?.user_id === 1) return true;
    const userGrups = this.getUserRoles()
    return userGrups.includes(roleId)
  }

  hasPermission(roleId: number) {
    const decoded = this.getDecodedToken() as JwtCustomInterface;
    if (decoded?.user_id === 1) return true;
    const userGrups = this.getUserPermissions()
    return userGrups.includes(roleId)
  }

  deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

}
