import { Injectable } from '@angular/core';
import { Observable, of, Subject, observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { Api } from '../models/api.model';
import { wsModel } from '../models/webSocket.model';
@Injectable({
  providedIn: 'root',
})
export class MainService {
  public client: HttpClient;
  public api = Api;
  public list$ = new BehaviorSubject<any[]>([]);
  public resource: string | undefined;

  public list: any[] = [];

  constructor(client: HttpClient) {
    this.client = client;
  }

  getUrl() {
    return `${this.api}/${this.resource}/`;
  }

  get(): Observable<any> {
    return this.client.get<any>(this.getUrl());
  }
  getAsync<T>(): Promise<T> {
    return this.client.get<T>(this.getUrl()).toPromise() as Promise<T>;
  }

  getByID(id: number | string): Observable<any> {
    return this.client.get<any>(`${this.getUrl()}${id}`);
  }

  create(body: any): Observable<any> {
    const head: any = {};
    head['Content-Type'] = 'application/json';
    return this.client.post(this.getUrl(), body, head);
  }

  update(body: any, id: string | number): Observable<any> {
    const head: any = {};
    head['Content-Type'] = 'application/json';
    return this.client.put(`${this.getUrl()}${id}`, body, head);
  }

  delete(id: any): Observable<any> {
    const head: any = {};
    head['Content-Type'] = 'application/json';
    return this.client.delete(this.getUrl() + id, head);
  }

  getList() {
    return this.list$.asObservable();
  }

  updateList(data: wsModel) { }

  errorObten(err: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Ah ocurrido un error al momento de traer los datos',
      showConfirmButton: true,
    });
  }

  successObten() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
    });
  }

  realizado() {
    // alertify.success('Realizado');
  }
}
