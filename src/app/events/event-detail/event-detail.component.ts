import { Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  standalone: true,
  selector: 'event-detail',
  imports: [EventCardComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent {
  #title = inject(Title);
  #router = inject(Router);

  event = input.required<MyEvent>();

  constructor() {
    effect(() => this.#title.setTitle(this.event().title + ' | SvTickets'));
  }

  goBack() {
    this.#router.navigate(['/events']);
  }
}

//TODO implement event map
//TODO attending users list (updated when self attending toggles)
//TODO implement comments viewing and form (POST /events/:id/comments, template in 1st project, format: { comment: "User comment" })

//Possible comment form:
// <form class="mt-4">
//  <div class="form-group">
//  <textarea class="form-control" name="comment" placeholder="Write a comment"></textarea>
//  </div>
//  <button type="submit" class="btn btn-primary mt-3">Send</button>
//  </form>

//Add this css to comments template
// user-info {
//   width: 8rem;
//   .avatar {
//   width: 4rem;
//   }
//  }
//  .comment {
//   white-space: pre-wrap;
//  }
