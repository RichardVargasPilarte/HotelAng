import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptorInterceptor } from './Interceptores/jwt.interceptor';
import { RedirIfFailPipe } from './Pipes/redir-if-fail.pipe';

// rutas
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// Modulos
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';

// Servicios
import { AlojamientoService } from './services/alojamiento.service';
import { GruposService } from './services/grupos.service';
import { HabitacionService } from './services/habitacion.service';
import { JwtService } from './services/jwt.service';
import { MainService } from './services/main.service';
import { UsuariosService } from './services/usuarios.service';
import { WebsocketService } from './services/websocket.service';

import {UserGuardGuard } from './Guards/user.guard';

import { } from '../environments/environment';

const Servicios = [
  AlojamientoService,
  GruposService,
  HabitacionService,
  JwtService,
  MainService,
  UsuariosService,
  WebsocketService,
];

@NgModule({
  declarations: [AppComponent, RedirIfFailPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    ComponentsModule
  ],
  exports: [],
  providers: [
    Servicios,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true,
    },
    UserGuardGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
