import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { Router, RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'event-card',
  imports: [DatePipe, IntlCurrencyPipe, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  event = input.required<MyEvent>();
  deleted = output<number>();
  attend = output<void>();

  deleteEvent() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.deleted.emit(this.event().id!);
        this.#router.navigate(['/events']);
      });
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'badImageAlt.png'; 
  }
  
  

  toggleAttend() {
    if (this.event().attend) {
      this.#eventsService
        .deleteAttendee(this.event().id)
        .pipe()
        .subscribe(() => this.attend.emit());
      this.event().attend = false;
      this.event().numAttend--;
    } else {
      this.#eventsService
        .postAttendee(this.event().id)
        .pipe()
        .subscribe(() => this.attend.emit());
      this.event().attend = true;
      this.event().numAttend++;
    }
  }
}
