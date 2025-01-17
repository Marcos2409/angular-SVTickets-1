import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
    title: 'Profile | SVTickets',
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
    title: 'Profile | SVTickets',
  },
];
