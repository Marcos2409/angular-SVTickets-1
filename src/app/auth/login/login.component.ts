import { Component, DestroyRef, inject, output } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { GeolocationServicesService } from '../../shared/services/geolocation-services.service';
import { Coordinates } from '../../shared/interfaces/coordinates';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleLoginDirective } from '../../google-login/google-login.directive';
import { GoogleFbLogin, UserLogin } from '../../shared/interfaces/user';
import { map, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ValidationClassesDirective,
    GoogleLoginDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements CanComponentDeactivate {
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  coords = output<Coordinates>();
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #saved = false;
  #modal = inject(NgbModal);

  constructor() {
    GeolocationServicesService.getLocation().then(
      (coords) => {
        this.loginForm.patchValue({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching geolocation:', error);
      }
    );
  }

  login(): void {
    const user: UserLogin = {
      ...this.loginForm.getRawValue(),
      lat: 0,
      lng: 0,
    };

    this.#authService
      .login(user)
      .pipe(
        map(() => {
          this.#saved = true;
          this.#router.navigate(['/events']);
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Login error: ', error);
        },
      });
  }

  googleUserLogin(userData: GoogleFbLogin): Observable<void> {
    return new Observable<void>((loginObs) => {
      this.#authService
        .googleFbLogin(userData)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            loginObs.next();
            loginObs.complete();
          },
          error: (error) => {
            loginObs.error(error);
          },
        });
    });
  }

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: [0],
    lng: [0],
  });

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    const googleLoginData = {
      token: resp.credential,
      lat: 0,
      lng: 0,
    };

    this.googleUserLogin(googleLoginData);
  }

  canDeactivate() {
    if (this.#saved || this.loginForm.pristine) {
      return true;
    }
    const modalRef = this.#modal.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }
}

//TODO Google & Facebook login
//TODO show login/register buttons only when user is not logged
