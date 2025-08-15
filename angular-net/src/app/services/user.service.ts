import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConnectionService } from './api-connection.service';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';
import { ChangePasswordRequest } from '../models/change-password.model';
import { ApiRoutes } from '../config/route-paths';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = ApiRoutes.user;

  constructor(private api: ApiConnectionService, private cookieService: CookieService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>(this.endpoint, true);
  }


  getProfile(): Observable<User> {
    const token = this.cookieService.get('token');
    if (!token) throw new Error('No token found');

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      const userId: number = +payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      return this.api.get<User[]>(this.endpoint, true).pipe(
        map((users: User[]) => {
          const matchedUser = users.find((u: User) => u.id === userId);
          if (!matchedUser) throw new Error('Logged-in user not found in response');
          return matchedUser;
        })
      );
    } catch (err) {
      return throwError(() => new Error('Invalid token format'));
    }
  }

  updateProfile(id: number, data: User): Observable<User> {
    return this.api.put(`${this.endpoint}/${id}`, data, true);
  }


  getById(id: number): Observable<User | null> {
    return this.api.get<User>(`${this.endpoint}/${id}`, true).pipe(
      catchError((err) => {
        if (err.status === 400) {
          return of(null);
        }
        throw err;
      })
    );
  }

  create(user: Partial<User>): Observable<User> {
    return this.api.post<User>(this.endpoint, user, true);
  }

  update(user: User): Observable<any> {
      return this.api.put(`${this.endpoint}/${user.id}`, user, true);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`, true);
  }

  softDelete(): Observable<void> {
    const token = this.cookieService.get('token');
    if (!token) return throwError(() => new Error('No token found'));

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const userId: number = +payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return this.delete(userId);
    } catch {
      return throwError(() => new Error('Invalid token format'));
    }
  }

  changePassword(payload: ChangePasswordRequest): Observable<string> {
    return this.api.put<any>(`${this.endpoint}/${ApiRoutes.changePassword}`, payload, true)
      .pipe(
        map(response => {
          return response as string;
        })
      );
  }

  changeUserRole(id: number, newRole: string): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${id}${ApiRoutes.changeUserRole}`, JSON.stringify(newRole), true);
  }

  deactivateUser(id: number): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${id}${ApiRoutes.deactivateUser}`, null, true);
  }

  activateUser(id: number): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${id}${ApiRoutes.activateUser}`, null, true);
  }


  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(this.endpoint, true);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users =>
        users.filter(user =>
          (`${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase()))
        )
      )
    );
  }
}
