import { Component, OnInit } from '@angular/core';
import { JwtService } from './services/jwt.service';
import { WebsocketService } from './services/websocket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Hotel';

  public verified = false;

  constructor(private JwtService: JwtService, private ws: WebsocketService) {}

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
          }
        },
        (err) => this.JwtService.logout()
      );
    } else {
      alert('No hay token');
    }
  }
}
