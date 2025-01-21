import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { map, Observable } from 'rxjs';
import {
  EventsResponse,
  SingleEventResponse,
} from '../../shared/interfaces/responses';

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

  getEvents(search = "", page = 1, order = "distance"): Observable<EventsResponse> {
    const searchParams: URLSearchParams = new URLSearchParams({
      search,
      page: String(page),
      order
    });
    return this.#http.get<EventsResponse>(`events?${searchParams.toString()}`);
  }

  getEvent(id: number): Observable<MyEvent> {
    return this.#http
      .get<SingleEventResponse>(`events/${id}`)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event: MyEvent): Observable<MyEvent> {
    return this.#http
      .post<SingleEventResponse>('events', event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void> {
    return this.#http.delete<void>(`events/${id}`);
  }
}
