import { Component, ViewChild, } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';


import { delay } from 'rxjs/operators';

import { JwtService } from '../../services/jwt.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CambioContrasenaComponent } from 'src/app/auth/cambio-contrasena/cambio-contrasena.component';
import JwtCustomInterface from '../../models/jwtInterface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  panelOpenState = false;

  constructor(
    private observer: BreakpointObserver,
    private jwt: JwtService,
    private readonly dialog: MatDialog,
    public jwtService: JwtService
  ) { }

  public obtenerNombre = this.jwt.getDecodedToken() as JwtCustomInterface;

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.jwt.logout();
  }

  okay(): boolean {
    const aux = this.jwt.loggedIn;
    return aux;
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  openUserPasswordReset() {
    this.dialog.open(CambioContrasenaComponent, {})
  }
}

