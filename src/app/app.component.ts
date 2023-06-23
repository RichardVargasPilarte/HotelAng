import { Component, OnInit } from '@angular/core';
import { ClienteService } from './services/cliente.service';
import { JwtService } from './services/jwt.service';
import { WebsocketService } from './services/websocket.service';

import { AlojamientoService } from './services/alojamiento.service';
import { HabitacionService } from './services/habitacion.service';
import { ReservaService } from './services/reserva.service';
import { UsuarioService } from './services/usuario.service';

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
    console.log();
    if (this.JwtService.Token) {
      this.JwtService.tokenVerify().subscribe(
        (res) => {
          if (this.JwtService.isAuthenticated() && this.JwtService.loggedIn) {
            this.ws.setsock();
            this.loadData();
          }
        },
        (err) => this.JwtService.logout()
      );
    } else {
      alert('No hay token');
    }
  }
  async loadData() {
    const customers = await this.clienteService.getCustomers()
    const alojamientos = await this.alojamientoService.getAlojamientos()
    const habitaciones = await this.habitacionService.getHabitaciones()
    const reservas = await this.reservaService.getReservas()
    const usuarios = await this.usuarioService.getUsuarios()
    console.log(customers, alojamientos, habitaciones, reservas, usuarios)
  }
}
