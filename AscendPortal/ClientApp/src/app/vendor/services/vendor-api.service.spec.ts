import { TestBed, inject } from '@angular/core/testing';

import { VendorApiService } from './vendor-api.service';

describe('VendorApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorApiService]
    });
  });

  it('should be created', inject([VendorApiService], (service: VendorApiService) => {
    expect(service).toBeTruthy();
  }));
});
