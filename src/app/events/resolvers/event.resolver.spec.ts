import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { eventResolver } from './event-resolver.resolver';
import { MyEvent } from '../../shared/interfaces/my-event';

describe('eventResolver', () => {
  const executeResolver: ResolveFn<MyEvent> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => eventResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
