import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let user = localStorage.getItem('user');
    if (this.authService.loggedIn()) {
      // if (
      //   route.data.roles &&
      //   route.data.roles.indexOf(JSON.parse(user).userType) === -1
      // ) {
      //   this.router.navigate(['/']);
      //   return false;
      // }
      console.log('hello');
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
