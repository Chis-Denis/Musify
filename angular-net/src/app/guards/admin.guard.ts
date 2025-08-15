import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RoutePaths } from '../config/route-paths';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(): boolean {
    const token = this.cookieService.get('token');

    if (!token) {
      return this.redirectToHome();
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload[ROLE_CLAIM];
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp && now >= exp) {
        this.cookieService.delete('token');
        return this.redirectToLogin();
      }

      if (role?.toLowerCase() === 'admin') {
        return true;
      }

      return this.redirectToHome();

    } catch (err) {
      console.error('[AdminGuard] Invalid token format:', err);
      return this.redirectToLogin();
    }
  }

  private redirectToHome(): boolean {
    this.router.navigate([RoutePaths.home]);
    return false;
  }

  private redirectToLogin(): boolean {
    this.router.navigate([RoutePaths.login]);
    return false;
  }
}
