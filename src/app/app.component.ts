import { Component } from '@angular/core';
import { TopMenuComponent } from './shared/top-menu/top-menu.component';
import { RouterOutlet } from '@angular/router';
import { animate, group, query, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, TopMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
       // Animación para eventDetail (aparece desde el centro)
       transition('* => eventDetail', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':enter', style({ transform: 'scale(0.5)', opacity: 0 }), { optional: true }),
        group([
          query(':leave', [
            animate('0.3s', style({ transform: 'scale(0.5)', opacity: 0 })),
          ], { optional: true }),
          query(':enter', [
            animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })),
          ], { optional: true }),
        ]),
      ]),

      // Transición de eventDetail hacia otra página
      transition('eventDetail => *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':leave', style({ transform: 'scale(1)', opacity: 1 }), { optional: true }),
        group([
          query(':leave', [
            animate('0.3s ease-in', style({ transform: 'scale(0.5)', opacity: 0 })),
          ], { optional: true }),
          query(':enter', [
            animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 })),
          ], { optional: true }),
        ]),
      ]),

      // Transition to eventsPage
      transition('* => eventsPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })), // La nueva página entra desde la izquierda
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })), // La página actual sale hacia la derecha
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]), // La nueva página se posiciona
        ]),
      ]),

      // Transition from eventsPage to other pages
      transition('eventsPage => *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(100%)' })), // La nueva página entra desde la derecha
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(-100%)' })), // La página actual sale hacia la izquierda
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]), // La nueva página se posiciona
        ]),
      ]),

      // Transition to profilePage
      transition('* => profilePage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(100%)' })), // La nueva página entra desde la derecha
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(-100%)' })), // La página actual sale hacia la izquierda
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]), // La nueva página se posiciona
        ]),
      ]),

      // Transition from profilePage to other pages
      transition('profilePage => *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })), // La nueva página entra desde la izquierda
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })), // La página actual sale hacia la derecha
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]), // La nueva página se posiciona
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'angular-svtickets';
  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
