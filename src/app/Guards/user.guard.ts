import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IRouteData } from '../app-routing.module';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard  {
  constructor(
    private jwt: JwtService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.jwt.loggedIn) {
      return true;
    } else {
      if ((route.data as IRouteData).isPublic) return true;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
