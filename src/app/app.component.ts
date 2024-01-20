import { Component, OnInit } from '@angular/core';
import { ClienteService } from './services/cliente.service';
import { JwtService } from './services/jwt.service';
import { WebsocketService } from './services/websocket.service';

import { AlojamientoService } from './services/alojamiento.service';
import { HabitacionService } from './services/habitacion.service';
import { ReservaService } from './services/reserva.service';
import { UsuarioService } from './services/usuario.service';
import { GruposService } from './services/grupos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Hotel';

  public verified = false;

  constructor(
    private JwtService: JwtService,
    private ws: WebsocketService,
    private readonly clienteService: ClienteService,
    private readonly alojamientoService: AlojamientoService,
    private readonly habitacionService: HabitacionService,
    private readonly reservaService: ReservaService,
    private readonly usuarioService: UsuarioService,
    private readonly grupoService: GruposService,
  ) { }

  ngOnInit(): void {
    this.token();
  }

  verificar(): boolean {
    const aux = this.JwtService.loggedIn;
    const aux2 = this.JwtService.isAuthenticated();
    return aux && aux2;
  }

  token(): void {
    if (this.JwtService.Token) {
      this.JwtService.tokenVerify().subscribe(
        {
          next: () => {
            if (this.JwtService.isAuthenticated() && this.JwtService.loggedIn) {
              this.ws.setsock();
              this.loadData();
            }
          },
          error: () => this.JwtService.logout()
        }

      );
    } else {
      alert('No hay token');
    }
  }

  async loadData() {
    try {
      const [
        customers,
        alojamientos,
        habitaciones,
        reservas,
        usuarios,
        grupos,
      ] = await Promise.all([
        this.clienteService.getClientsAsynchronous(),
        this.alojamientoService.getAccommodationsAsynchronous(),
        this.habitacionService.getRoomsAsynchronous(),
        this.reservaService.getAsynchronousReservations(),
        this.usuarioService.getAsynchronousUsers(),
        this.grupoService.getGroupsAsynchronous(),
      ]);

      console.log(customers, alojamientos, habitaciones, reservas, usuarios,grupos);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  }

}
