import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
// import { EventFormComponent } from '../event-form/event-form.component';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'events-page',
  imports: [EventCardComponent, FormsModule],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
})
export class EventsPageComponent {
  #destroyRef = inject(DestroyRef);
  #eventsService = inject(EventsService);

  events = signal<MyEvent[]>([]);
  search = signal<string>('');

  filteredEvents = computed(() => {
    const searchLower = this.search().toLowerCase();
    return this.events().filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
    );
  });

  constructor() {
    console.log(this.#eventsService.getEvents());

    this.#eventsService
      .getEvents()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => this.events.set(res.events));
  }

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }

  orderDate() {
    this.events.update((events) =>
      events.toSorted((e1, e2) => e1.date.localeCompare(e2.date))
    );
  }

  orderPrice() {
    this.events.update((events) =>
      events.toSorted((e1, e2) => e1.price - e2.price)
    );
  }
}

//TODO attend button & functionality
//TODO when event is mine: delete and edit
//TODO event filtering, showing filters to the user as text
