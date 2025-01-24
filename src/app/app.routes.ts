import { Routes } from '@angular/router';
import { loginActivateGuard } from './shared/guards/login-activate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    data: { animation: 'auth' }
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.routes').then((m) => m.eventsRoutes),
    canActivate: [loginActivateGuard],
    data: { animation: 'events' }
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileRoutes),
    canActivate: [loginActivateGuard],
    data: { animation: 'profile' }
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
