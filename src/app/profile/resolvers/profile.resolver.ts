import { ResolveFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { User } from '../../shared/interfaces/user';
import { inject } from '@angular/core';

export const profileResolver: ResolveFn<User> = (route) => {
  const profileService = inject(ProfileService);
  if (route.params['id']) {
    return profileService.getProfile(+route.params['id']);
  }
  return profileService.getProfile();
};
