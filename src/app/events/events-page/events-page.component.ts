import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProfileService } from '../../profile/services/profile.service';

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
  #profileService = inject(ProfileService);

  events = signal<MyEvent[]>([]);
  currentPage = signal<number>(1);
  eventsLeft = signal<boolean>(false);
  order = signal<string>('distance');
  creator = input<number>();
  attending = input<number>();

  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filterDescription = signal<string>('');

  constructor() {
    effect(() => {
      this.loadEvents(this.creator(), this.attending());
    });

    effect(() => {
      const searchTerm = this.search()?.trim();
      const orderBy = this.order();
      const creatorId = this.creator();
      const attendingId = this.attending();
      const filters: string[] = [];

      if (creatorId) {
        this.#profileService.getProfile(creatorId).subscribe((user) => {
          const creatorName = user.name;
          filters.push(`Events created by ${creatorName}`);
          this.filterDescription.set(filters.join('. '));
        });
      }

      if (attendingId) {
        this.#profileService.getProfile(attendingId).subscribe((user) => {
          const attendingName = user.name;
          filters.push(`Events ${attendingName} is attending`);
          this.filterDescription.set(filters.join('. '));
        });
      }

      if (searchTerm) {
        filters.push(`Filtered by "${searchTerm}"`);
      }

      if (orderBy) {
        filters.push(`Ordered by ${orderBy}`);
      }

      this.filterDescription.set(
        filters.length > 0 ? filters.join('. ') : 'No current filters.'
      );
    });
  }

  loadEvents(creator?: number, attending?: number) {
    this.#eventsService
      .getEvents(
        this.currentPage(),
        this.search()!,
        this.order(),
        creator,
        attending
      )
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
