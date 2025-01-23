import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
// import { baseUrlInterceptor } from '../../shared/interceptors/base-url.interceptor';
import { GoogleFbLogin, User, UserLogin } from '../../shared/interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { TokenResponse } from '../../shared/interfaces/responses';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #logged: WritableSignal<boolean> = signal(false);
  #router = inject(Router);

  getLogged(): boolean {
    return this.#logged();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`auth/login`, data).pipe(
      map((response: TokenResponse) => {
        this.#logged.set(true);
        localStorage.setItem('authToken', response.accessToken);
      }),
      catchError((error) => {
        const errorMessage = Array.isArray(error.error);
        alert(errorMessage);

        return of();
      })
    );
  }

  googleFbLogin(data: GoogleFbLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`auth/google`, data).pipe(
      map((response: TokenResponse) => {
        this.#logged.set(true);
        localStorage.setItem('authToken', response.accessToken);
      }),
      catchError((error) => {
        const errorMessage = Array.isArray(error.error);
        alert(errorMessage);

        return of();
      })
    );
  }
  
  fbLogin(data: GoogleFbLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`auth/facebook`, data).pipe(
      map((response: TokenResponse) => {
        this.#logged.set(true);
        localStorage.setItem('authToken', response.accessToken);
      }),
      catchError((error) => {
        const errorMessage = Array.isArray(error.error);
        alert(errorMessage);

        return of();
      })
    );
  }

  logout(): void {
    this.#logged.set(false);
    localStorage.removeItem('authToken');
    this.#router.navigate(['/login']);
  }

  isLogged(): Observable<boolean> {
    const token = localStorage.getItem('authToken');

    if (!token) return of(false);
    if (this.#logged()) return of(true);

    return this.validateToken();
  }

  register(data: User): Observable<void> {
    return this.#http.post<void>('auth/register', data).pipe(
      map(() => {
        alert('User succesfully registered');
      }),
      catchError((error) => {
        const errorMessage = Array.isArray(error.error)
          ? error.error.join('\n')
          : error.error?.message || 'An unknown error occurred.';
        alert(errorMessage);

        return of();
      })
    );
  }

  validateToken(): Observable<boolean> {
    return this.#http.get('auth/validate').pipe(
      map(() => {
        this.#logged.set(true);
        return true;
      }),
      catchError(() => {
        localStorage.removeItem('authToken');
        this.#logged.set(false);
        return of(false);
      })
    );
  }
}

//TODO check login logic & implement Google & Facebook login
