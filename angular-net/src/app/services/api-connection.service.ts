import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });
  }



get<T>(endpoint: string, auth: boolean = false, queryParams?: Record<string, any>): Observable<T> {
  let params = new HttpParams();

  if (queryParams) {
    for (const key in queryParams) {
      const value = queryParams[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value);
      }
    }
  }

  return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
    headers: auth ? this.getAuthHeaders() : undefined,
    params: queryParams ? params : undefined
  });
}


  post<T>(endpoint: string, body: any, auth: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: auth ? this.getAuthHeaders() : undefined,
    });
  }

  put<T>(
    endpoint: string,
    body: any,
    auth: boolean = false
  ): Observable<T> {
    const headers = auth
      ? this.getAuthHeaders().set('Content-Type', 'application/json')
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body ?? {},
      { headers, observe: 'body', responseType: 'json' }
    );
  }

  delete<T>(endpoint: string, auth?: boolean): Observable<T>;
  delete<T>(endpoint: string, auth: boolean, body: any): Observable<T>;

  delete<T>(endpoint: string, auth: boolean = false, body?: any): Observable<T>{
    const options: {
      headers?: HttpHeaders;
      body?: any;
      observe: 'body';
      responseType: 'json';
    } = {
      headers: auth ? this.getAuthHeaders() : undefined,
      observe: 'body',
      responseType: 'json',
    };

    if (body !== undefined){
      options.body = body;
    }

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);

  }
}
