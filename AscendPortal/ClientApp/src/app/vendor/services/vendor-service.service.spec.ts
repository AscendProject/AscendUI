import { TestBed, inject } from '@angular/core/testing';

import { VendorServiceService } from './vendor-service.service';

describe('VendorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorServiceService]
    });
  });

  it('should be created', inject([VendorServiceService], (service: VendorServiceService) => {
    expect(service).toBeTruthy();
  }));
});
