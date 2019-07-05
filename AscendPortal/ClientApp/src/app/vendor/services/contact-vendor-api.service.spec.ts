import { TestBed, inject } from '@angular/core/testing';

import { ContactVendorApiService } from './contact-vendor-api.service';

describe('ContactVendorApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactVendorApiService]
    });
  });

  it('should be created', inject([ContactVendorApiService], (service: ContactVendorApiService) => {
    expect(service).toBeTruthy();
  }));
});
