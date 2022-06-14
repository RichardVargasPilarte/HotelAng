import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { AlojamientoService } from './alojamiento.service';
import { HabitacionService } from './habitacion.service';
import { ip } from '../Models/api.model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: WebSocket | undefined;
  constructor(
    private jwt: JwtService,
    private Aloj$: AlojamientoService,
    private Habit$: HabitacionService
  ) {}

  private MAX_RECONNECTION = 5;
  private contador = 0;

  setsock() {
    this.socket = new WebSocket(`ws://${ip}/ws/?access=${this.jwt.Token}`);
    // console.log((`ws://${ip}:8000/ws/?token=${this.jwt.Token}`));

    this.socket.onopen = () => {
      console.log('WebSockets connection created for Socket Service');
      if (this.contador > 1) {
        // alertify.success('WebSocket reconectado, si hay multiples usuarios trabajando es recomendable recargar la pagina');
      }
      this.contador = 1;
    };

    this.socket.onmessage = (event) => {
      const action = JSON.parse(event.data);
      console.log('hola', event);
      switch (action.model) {
        case 'Alojamiento':
          this.Aloj$.updateList(action);
          break;
        case 'Habitacion':
          this.Habit$.updateList(action);
          break;
      }
    };
    this.socket.onclose = () => {
      // connection closed, discard old websocket and create a new one
      if (this.contador !== 0 && this.contador <= this.MAX_RECONNECTION) {
        console.log(
          `reconectando ws intento ${this.contador} de ${this.MAX_RECONNECTION}`
        );
        this.socket = undefined;
        const p3 = new Promise<void>((resolve) => {
          // alertify.error(`reconectando ws intento ${this.contador} de ${this.MAX_RECONNECTION}`);
          this.contador++;
          setTimeout(() => {
            this.setsock();
          }, 3000 * this.contador);
          resolve();
        });
      } else {
        // alertify.confirm('Recargar pagina')
        // .set('onok', () => {
        //   window.location.reload();
        // })
        // .set({ title: 'Error de conexion' });
      }
    };
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.onopen(null as any);
    }
  }
}
