import { Component, DestroyRef, inject, output, signal } from '@angular/core';
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
    GaAutocompleteDirective
  ],
  providers: [DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements CanComponentDeactivate {
  added = output<MyEvent>();
  #eventsService = inject(EventsService);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #datePipe = inject(DatePipe);
  #destroyRef = inject(DestroyRef);
  #modal = inject(NgbModal);

  //OL map implementation
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>("");

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
    console.log(this.address());
    console.log(this.coordinates());
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
  });

  imageBase64 = '';
  saved = false;

  addEvent(): void {
    const newEvent: MyEventInsert = {
      ...this.eventForm.getRawValue(),
      image: this.imageBase64,
      lat: this.coordinates()[0],
      lng: this.coordinates()[1],
      address: this.address(),
    };
  
    this.#eventsService
      .addEvent(newEvent as MyEvent)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.saved = true;
        this.#router.navigate(['/events']);
      });
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

//TODO implement editing. If id providen to URI, edit that id event, if not, new event
