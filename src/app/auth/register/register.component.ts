import { Component, DestroyRef, inject, output } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { emailsMatchValidator } from '../../shared/validators/email-check.validator';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { GeolocationServicesService } from '../../shared/services/geolocation-services.service';
import { Coordinates } from '../../shared/interfaces/coordinates';
import { User } from '../../shared/interfaces/user';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  standalone: true,
  selector: 'register',
  imports: [
    FormsModule,
    EncodeBase64Directive,
    ReactiveFormsModule,
    ValidationClassesDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements CanComponentDeactivate {
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  coords = output<Coordinates>();
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #modal = inject(NgbModal);

  constructor() {
    GeolocationServicesService.getLocation().then(
      (coords) => {
        this.registerForm.patchValue({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching geolocation:', error);
      }
    );
  }

  registerForm = this.#fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      lat: [0],
      lng: [0],
      avatar: ['', [Validators.required]],
    },
    { validators: emailsMatchValidator }
  );

  imageBase64 = '';

  newUser: User = {
    name: '',
    email: '',
    password: '',
    avatar: '',
    lat: 0,
    lng: 0,
  };
  #saved = false;

  addUser() {
    const rawValue = this.registerForm.getRawValue();

    const user: User = {
      ...rawValue,
      lat: rawValue.lat || 0,
      lng: rawValue.lng || 0,
    };

    this.#authService
      .register(user)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['login']);
      });
  }

  canDeactivate() {
    if (this.#saved || this.registerForm.pristine) {
      return true;
    }
    const modalRef = this.#modal.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }
}
