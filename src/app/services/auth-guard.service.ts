import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: JwtService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/Login']);
      return false;
    }
    return true;
  }
}
