import { TestBed } from '@angular/core/testing';

import { GeolocationServicesService } from './geolocation-services.service';

describe('GeolocationServicesService', () => {
  let service: GeolocationServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
