import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { AlojamientoService } from './alojamiento.service';
import { HabitacionService } from './habitacion.service';
import { ip } from '../Models/api.model';
import { UsuarioService } from './usuario.service';
import { ClienteService } from './cliente.service';
import { ReservaService } from './reserva.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: WebSocket | undefined;
  constructor(
    private jwt: JwtService,
    private Aloj$: AlojamientoService,
    private Habit$: HabitacionService,
    private User$: UsuarioService,
    private Client$: ClienteService,
    private Reserv$: ReservaService
  ) {}

  private MAX_RECONNECTION = 5;
  private contador = 0;

  setsock() {
    this.socket = new WebSocket(`ws://${ip}/ws/?access=${this.jwt.Token}`);

    this.socket.onopen = () => {
      console.log('WebSockets connection created for Socket Service');
      if (this.contador > 1) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'WebSocket reconectado, si hay multiples usuarios trabajando es recomendable recargar la pagina',
          showConfirmButton: true,
        })
      }
      this.contador = 1;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      let action = JSON.parse(event.data);
      action = {
        data: JSON.parse(action.message.data),
        event: action.message.event,
        model: action.message.model
      }
      switch (action.model) {
        case 'Alojamiento':
          this.Aloj$.updateList(action);
          break;
        case 'Habitacion':
          this.Habit$.updateList(action);
          break;
        case 'Usuario':
          this.User$.updateList(action);
          break;
        case 'Cliente':
          this.Client$.updateList(action);
          break;
        case 'Reserva':
          this.Reserv$.updateList(action);
          break;
      }
    };
    this.socket.onclose = () => {
      if (this.contador !== 0 && this.contador <= this.MAX_RECONNECTION) {
        console.log(
          `reconectando ws intento ${this.contador} de ${this.MAX_RECONNECTION}`
        );
        this.socket = undefined;
        const p3 = new Promise<void>((resolve) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Reconectando websocket intento ${this.contador} de ${this.MAX_RECONNECTION}`,
            showConfirmButton: true,
          })
          this.contador++;
          setTimeout(() => {
            this.setsock();
          }, 3000 * this.contador);
          resolve();
        });
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error de conexion, por favor verificar su conexion a internet o recargar la pagina',
          showConfirmButton: true,
        })

      }
    };
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.onopen(null as any);
    }
  }
}
