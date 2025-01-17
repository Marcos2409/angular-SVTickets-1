import { Component, inject, output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { MyEvent } from '../../shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { DatePipe } from '@angular/common';
import { minDateValidator } from '../../shared/validators/min-date.validator';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';

@Component({
  selector: 'event-form',
  standalone: true,
  imports: [
    EncodeBase64Directive,
    ReactiveFormsModule,
    DatePipe,
    ValidationClassesDirective,
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

  newEvent: MyEvent = {
    title: '',
    description: '',
    date: '',
    image: '',
    price: 0,
  };
  saved = false;
  
  addEvent() {
    const event: MyEvent = {
      ...this.eventForm.getRawValue(),
      image: this.imageBase64,
    };
    this.#eventsService.addEvent(event).subscribe(() => {
      this.saved = true;
      this.#router.navigate(['/events']);
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.newEvent.image = '';
    }
  }

  canDeactivate() {
    return (
      this.saved ||
      this.eventForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }

  getDate(): string {
    const today = new Date();

    return this.#datePipe.transform(today, 'yyyy-MM-dd') || '';
  }
}

//TODO implement feedback for the user
//TODO implement map to select event location
//TODO implement editing. If id providen to URI, edit that id event, if not, new event