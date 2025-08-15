import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';

export const AuthGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('token');

  if (!token) {
    router.navigate([RoutePaths.login]);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp && now >= exp) {
      cookieService.delete('token');
      router.navigate([RoutePaths.login]);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Invalid token:', err);
    cookieService.delete('token');
    router.navigate([RoutePaths.login]);
    return false;
  }
};
