import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { MyEvent, MyEventInsert } from '../../shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { DatePipe } from '@angular/common';
import { minDateValidator } from '../../shared/validators/min-date.validator';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { SearchResult } from '../../shared/interfaces/search-result';
import { GaAutocompleteDirective } from '../../shared/directives/ol-maps/ga-autocomplete.directive';

@Component({
  standalone: true,
  selector: 'event-form',
  imports: [
    EncodeBase64Directive,
    ReactiveFormsModule,
    DatePipe,
    ValidationClassesDirective,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective,
  ],
  providers: [DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements CanComponentDeactivate {

  constructor() {
    effect(() => {
      if (this.event()) {
        this.eventForm.get('title')?.setValue(this.event().title);
        this.eventForm.get('date')?.setValue(this.event().date.split(' ')[0]);
        this.eventForm.get('description')?.setValue(this.event().description);
        this.eventForm.get('price')?.setValue(this.event().price);
        this.imageBase64 = this.event().image;
        this.coordinates.set([this.event().lat, this.event().lng]);
      }
    });
  }
  
  added = output<MyEvent>();
  #eventsService = inject(EventsService);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #datePipe = inject(DatePipe);
  #destroyRef = inject(DestroyRef);
  #modal = inject(NgbModal);

  coordinates = signal<[number, number]>([-0.5, 38.5]);
  event = input.required<MyEvent>();
  address = "";

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    // this.eventForm.get('address')?.setValue(result.address);
    this.address = result.address;
  }

  eventForm = this.#fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      ],
    ],
    date: ['', [Validators.required, minDateValidator(this.getDate())]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    image: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  imageBase64 = '';
  saved = false;

  addEvent(): void {
    const newEvent: MyEventInsert = {
      ...this.eventForm.getRawValue(),
      image: this.imageBase64,
      lat: this.coordinates()[1],
      lng: this.coordinates()[0],
      address: this.address
    };

    if (!this.event()) {
      this.#eventsService
        .addEvent(newEvent)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.saved = true;
          this.#router.navigate(['/events']);
        });
    } else {
      this.#eventsService
        .updateEvent(newEvent, this.event().id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.saved = true;
          this.#router.navigate(['/events']);
        });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.imageBase64 = '';
    }
  }

  canDeactivate() {
    if (this.saved || this.eventForm.pristine) {
      return true;
    }
    const modalRef = this.#modal.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }

  getDate(): string {
    const today = new Date();
    return this.#datePipe.transform(today, 'yyyy-MM-dd') || '';
  }
}