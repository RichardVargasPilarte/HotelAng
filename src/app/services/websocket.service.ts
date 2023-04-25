import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { AlojamientoService } from './alojamiento.service';
import { HabitacionService } from './habitacion.service';
import { ip } from '../models/api.model';
import { UsuariosService } from './usuarios.service';
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
    private User$: UsuariosService,
    private Client$: ClienteService,
    private Reserv$: ReservaService
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'WebSocket reconectado, si hay multiples usuarios trabajando es recomendable recargar la pagina',
          showConfirmButton: false,
          timer: 1500
        })
      }
      this.contador = 1;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log('hola', event);
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
      // connection closed, discard old websocket and create a new one
      if (this.contador !== 0 && this.contador <= this.MAX_RECONNECTION) {
        console.log(
          `reconectando ws intento ${this.contador} de ${this.MAX_RECONNECTION}`
        );
        this.socket = undefined;
        const p3 = new Promise<void>((resolve) => {
          // alertify.error(`reconectando ws intento ${this.contador} de ${this.MAX_RECONNECTION}`);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reconectando websocket intento ${this.contador} de ${this.MAX_RECONNECTION}`',
            showConfirmButton: false,
            timer: 1500
          })
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
