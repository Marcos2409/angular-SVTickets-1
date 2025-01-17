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

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ValidationClassesDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  coords = output<Coordinates>();
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

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

  login() {
    const rawValue = this.loginForm.getRawValue();

    this.#authService
      .login(rawValue)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#router.navigate(['/events']);
      });
  }

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: [0],
    lng: [0],
  });
}

//TODO Google & Facebook login
//TODO show login/register buttons only when user is not logged
