import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  standalone: true,
  selector: 'events-page',
  imports: [EventCardComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPageComponent {
  #destroyRef = inject(DestroyRef);
  #eventsService = inject(EventsService);

  events = signal<MyEvent[]>([]);
  currentPage = signal<number>(1);
  eventsLeft = signal<boolean>(false);
  order = signal<string>('distance');

  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filterDescription = computed(() => {
    const searchTerm = this.search()?.trim();
    const orderBy = this.order();
    const filters = [];
    if (searchTerm) {
      filters.push(`searching for "${searchTerm}"`);
    }
    if (orderBy) {
      filters.push(`ordered by ${orderBy}`);
    }
    return filters.length > 0
      ? `Current filters: ${filters.join(', ')}`
      : 'No current filters.';
  });

  constructor() {
    effect(() => {
      this.loadEvents();
    });
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.currentPage(), this.search()!, this.order())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        const uniqueEvents = [
          ...new Map(
            [...this.events(), ...res.events].map((e) => [e.id, e])
          ).values(),
        ];
        this.events.set(uniqueEvents);
        this.eventsLeft.set(res.more);
      });
  }

  loadMore() {
    this.currentPage.update((page) => page + 1);
    this.loadEvents();
  }

  orderDate() {
    this.order.set('date');
    this.resetPagination();
  }

  orderPrice() {
    this.order.set('price');
    this.resetPagination();
  }

  orderDistance() {
    this.order.set('distance');
    this.resetPagination();
  }

  resetPagination() {
    this.currentPage.set(1);
    this.events.set([]);
    this.loadEvents();
  }

  filteredEvents = computed(() => {
    const searchLower = this.search()!.toLowerCase();
    return this.events().filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
    );
  });

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }
}

//TODO attend button & functionality
//TODO when event is mine: delete and edit
//TODO event filtering, showing filters to the user as text
