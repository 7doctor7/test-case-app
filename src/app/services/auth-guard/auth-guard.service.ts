import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    const token = localStorage.getItem('token');

    if (token && token.length) {
      return true;
    }

    this.router.navigate(['/login'], { replaceUrl: true, skipLocationChange: false });
    return false;
  }
}
