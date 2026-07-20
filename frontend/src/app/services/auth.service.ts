import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  currentUserId = signal<number | null>(this.getStoredUserId());
  currentToken = signal<string | null>(localStorage.getItem('authToken'));

  constructor(private http: HttpClient) { }

  private getStoredUserId(): number | null {
    const stored = localStorage.getItem('currentUserId');
    return stored ? Number(stored) : null;
  }

  // chiama il vero endpoint di login del backend (email + password),
  // e se le credenziali sono corrette salva il token JWT ricevuto
  login(mail: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { mail, password }).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUserId', response.userId.toString());
    this.currentToken.set(response.token);
    this.currentUserId.set(response.userId);
  }

  getToken(): string | null {
    return this.currentToken();
  }

  isLoggedIn(): boolean {
    return this.currentToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserId');
    this.currentToken.set(null);
    this.currentUserId.set(null);
  }
}
