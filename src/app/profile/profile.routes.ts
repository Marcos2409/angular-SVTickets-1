import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';

export const profileRoutes: Routes = [
  {
    path: '',
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile | SVTickets',
    data: { animation: 'profilePage' }
  },
  {
    path: ':id',
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile | SVTickets',
    data: { animation: 'profilePage' }
  },
];
