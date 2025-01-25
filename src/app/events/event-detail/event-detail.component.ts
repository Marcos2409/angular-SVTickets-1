import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { EventsService } from '../services/events.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../shared/interfaces/user';
import { SingleCommentResponse } from '../../shared/interfaces/responses';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'event-detail',
  imports: [
    EventCardComponent,
    OlMapDirective,
    OlMarkerDirective,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent {
  #router = inject(Router);
  #eventService = inject(EventsService);
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);

  event = input.required<MyEvent>();
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>('');
  attendees = signal<User[]>([]);
  comments = signal<SingleCommentResponse[]>([]);
  attend = output<void>();

  commentForm = this.#fb.group({
    message: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.updateData();
    });
  }

  updateData() {
    if (this.event()) {
      this.setAttendees(this.event().id);
      this.setComments(this.event().id);
      this.coordinates.set([this.event().lng, this.event().lat]);
      this.address.set(this.event().address);
    }
  }

  setAttendees(id: number) {
    this.#eventService
      .getAttendees(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        this.attendees.set(result.users);
      });
  }

  setComments(id: number) {
    this.#eventService
      .getComments(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        this.comments.set(result.comments);
      });
  }

  postComment(event: Event): void {
    event.preventDefault();
    const comment = this.commentForm.getRawValue();
    const commentBody = comment.message;
    this.#eventService
      .postComment(this.event().id, commentBody)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((response) => {
        this.comments.update((comments) => [...comments, response]);
      });

    this.commentForm.reset();
  }

  goBack() {
    this.#router.navigate(['/events']);
  }
}

//TODO revisar y optimizar lógica, mucho gpt
