import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLogin, UserRegister, AuthResponse } from '../models/auth.model';
import { ApiRoutes } from '../config/route-paths';
import { ApiConnectionService } from './api-connection.service';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ForgotPasswordRequest, ResetPasswordRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiConnectionService, private cookieService: CookieService) {}

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(
      `${ApiRoutes.auth}${ApiRoutes.login}`,
      credentials
    ).pipe(
      tap((response: AuthResponse) => {
        this.cookieService.set('token', response.token, undefined, '/');
        this.cookieService.set('user', JSON.stringify(response.user), undefined, '/');
      })
    );
  }

  register(user: UserRegister): Observable<any> {
    return this.api.post<any>(
      `${ApiRoutes.auth}${ApiRoutes.register}`,
      user
    );
  }

  logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('user'); //cuchi
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('token');
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.api.post<any>(
      `${ApiRoutes.auth}/${ApiRoutes.forgotPassword}`,
      request
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.api.post<any>(
      `${ApiRoutes.auth}/${ApiRoutes.resetPassword}`,
      request
    );
  }
}
