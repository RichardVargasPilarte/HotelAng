import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import JwtCustomInterface from '../Models/jwtInterface';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  saveLocalStorage(token: string) {
    localStorage.setItem('access', token);
  }

  login(username: string, password: string) {
    return this.httpClient.post<any>(environment.API_Auth, { username, password }).pipe(tap(res => {
      this.saveLocalStorage(res.access);
    }));
  }

  logout() {
    localStorage.removeItem('access');
    window.location.reload();
  }

  public get loggedIn(): boolean {
    return !!localStorage.getItem('access')
  }

  getDecodedToken() {
    const token = localStorage.getItem('access');
    if (!token) return false;
    const decoded = jwtDecode<JwtCustomInterface>(token);
    return decoded;
  }

  public isAuthenticated(): boolean {
    const decoded = this.getDecodedToken();
    if (decoded) {
      if (decoded.exp === undefined) {
        return false;
      }
      if (decoded.exp < Date.now() / 1000) {
        return false;
      }
      return true;
    }
    return false;
  }

  public get Token(): string {
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

  hasPermissions(permissionIds: number[]) {
    const decoded = this.getDecodedToken() as JwtCustomInterface;
    if (decoded?.user_id === 1) return true;
    const userPermissions = this.getUserPermissions()
    return userPermissions.some((x) => permissionIds.includes(x))
  }

}
