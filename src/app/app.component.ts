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
      transition('* => eventForm', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(-100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]),
        ]),
      ]),
      transition('* => eventsPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]),
        ]),
      ]),
      transition('* => eventDetail', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]),
        ]),
      ]),
      transition('* => profilePage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'translateX(0)' }))]),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
