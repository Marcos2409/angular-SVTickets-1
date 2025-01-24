import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { User, UserProfileEdit } from '../../shared/interfaces/user';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RouterLink, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile-page',
  imports: [
    OlMapDirective,
    OlMarkerDirective,
    ReactiveFormsModule,
    EncodeBase64Directive,
    RouterLink,
    RouterModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  user = input.required<User>();

  showProfileForm = false;
  showPasswordForm = false;
  imageBase64 = '';

  #fb = inject(NonNullableFormBuilder);
  #profileService = inject(ProfileService);
  #destroyRef = inject(DestroyRef);

  profileDataForm = this.#fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
  });

  passwordForm = this.#fb.group({
    password: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this.profileDataForm.setValue({ name: user.name, email: user.email });
      }
    });
  }

  updateData() {
    if (this.user()) {
      this.profileDataForm.get('email')?.setValue(this.user().email);
      this.profileDataForm.get('name')?.setValue(this.user().name);
    }
  }

  setProfileForm = (userInfo: UserProfileEdit) => {
    if (this.user()) {
      this.profileDataForm.get('email')?.setValue(userInfo.email);
      this.profileDataForm.get('name')?.setValue(userInfo.name);
    }
  };

  toggleProfileForm() {
    this.showProfileForm = true;
    this.showPasswordForm = false;
    this.setProfileForm({
      name: this.user().name,
      email: this.user().email,
    });
  }

  togglePasswordForm() {
    this.showProfileForm = false;
    this.showPasswordForm = true;
  }

  hideFormButtons() {
    this.showProfileForm = false;
    this.showPasswordForm = false;
  }

  putProfileInfo() {
    const userInfo = this.profileDataForm.getRawValue();

    this.#profileService
      .updateProfile(userInfo)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.updateData();
      });

    this.hideFormButtons();
  }

  putPassword() {
    const newPassword = this.passwordForm.getRawValue();

    this.#profileService
      .updateUserPassword(newPassword)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.updateData());
    this.hideFormButtons();
  }

  handleAvatarChange(base64Image: string) {
    this.imageBase64 = base64Image;

    const avatarSend = { avatar: this.imageBase64 };

    this.#profileService
      .updateProfileAvatar(avatarSend)
      .subscribe(() => this.updateData());
  }
}
