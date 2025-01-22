import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MyEvent, MyEventInsert } from '../../shared/interfaces/my-event';
import { map, Observable } from 'rxjs';
import {
  CommentsResponse,
  EventsResponse,
  SingleCommentResponse,
  SingleEventResponse,
} from '../../shared/interfaces/responses';
import { User } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  #http = inject(HttpClient);

  toggleAttend(id: number, attend: boolean): Observable<boolean> {
    const isAttending = attend ? 'DELETE' : 'POST';
    return this.#http
      .request<void>(isAttending, `events/${id}/attend`)
      .pipe(map(() => !attend));
  }

  getEvents(
    page: number,
    search: string,
    order: string,
    creator?: number,
    attending?: number
  ): Observable<EventsResponse> {
    const searchParams = new URLSearchParams({
      search,
      page: String(page),
      order,
    });
  
    if (creator) {
      searchParams.append('creator', creator.toString());
    }
    if (attending) {
      searchParams.append('attending', attending.toString());
    }
  
    return this.#http.get<EventsResponse>(`events?${searchParams.toString()}`);
  }
  

  getEvent(id: number): Observable<MyEvent> {
    return this.#http
      .get<SingleEventResponse>(`events/${id}`)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event: MyEventInsert): Observable<MyEvent> {
    return this.#http
      .post<SingleEventResponse>('events', event)
      .pipe(map((resp) => resp.event));
  }

  updateEvent(event: MyEventInsert, id: number): Observable<MyEvent> {
    return this.#http
      .put<SingleEventResponse>(`events/${id}`, event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void> {
    return this.#http.delete<void>(`events/${id}`);
  }

  getAttendees(id: number): Observable<{ users: User[] }> {
    return this.#http.get<{ users: User[] }>(`events/${id}/attend`);
  }

  postAttendee(id: number) {
    return this.#http.post<void>(`events/${id}/attend`, null);
  }

  deleteAttendee(id: number): Observable<void> {
    return this.#http.delete<void>(`events/${id}/attend`);
  }

  getComments(id: number): Observable<CommentsResponse> {
    return this.#http.get<CommentsResponse>(`events/${id}/comments`);
  }

  postComment(
    id: number,
    commentBody: string
  ): Observable<SingleCommentResponse> {
    return this.#http.post<SingleCommentResponse>(`events/${id}/comments`, {
      comment: commentBody,
    });
  }
}
