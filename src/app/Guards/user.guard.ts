import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IRouteData } from '../app-routing.module';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
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

      console.log('Not authorized')

      this.router.navigate(['/login']);
      return false;
    }
  }
}
