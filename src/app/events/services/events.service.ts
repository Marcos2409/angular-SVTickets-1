import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { map, Observable } from 'rxjs';
import { EventsResponse, SingleEventResponse } from '../../shared/interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  #http = inject(HttpClient);

  getEvents(): Observable<MyEvent[]> {
    return this.#http
      .get<EventsResponse>(`events`)
      .pipe(map((resp) => resp.events));
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
