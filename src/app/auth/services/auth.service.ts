import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
// import { baseUrlInterceptor } from '../../shared/interceptors/base-url.interceptor';
import { User, UserLogin } from '../../shared/interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { TokenResponse } from '../../shared/interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #logged: WritableSignal<boolean> = signal(false);

  login(data: UserLogin): Observable<void> {
    return this.#http
      .post<TokenResponse>(`auth/login`, data)
      .pipe(
        map((response: TokenResponse) => {
          this.#logged.set(true);
          localStorage.setItem('authToken', response.accessToken);
        })
      );
  }

  logout(): void {
    this.#logged.set(false);
    localStorage.removeItem('authToken');
  }

  isLogged(): Observable<boolean> {
    if (!this.#logged() && !localStorage.getItem('authToken')) {
      return of(false);
    }
    if (this.#logged()) {
      return of(true);
    }
    if (!this.#logged() && localStorage.getItem('authToken')) {
      return this.#http
        .post('/auth/validate', localStorage.getItem('authToken'))
        .pipe(
          map(() => {
            this.#logged.set(true);
            return true;
          }),
          catchError(() => {
            localStorage.removeItem('authToken');
            return of(false);
          })
        );
    }
    return of(false);
  }

  register(data: User): Observable<void> {
    return this.#http.post<void>('auth/register', data);
  }
  
}

//TODO check login logic & implement Google & Facebook login