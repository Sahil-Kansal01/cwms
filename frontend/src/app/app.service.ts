import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/auth/login'; // Your backend login URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean | null | string {
    const token = this.getToken();
    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
