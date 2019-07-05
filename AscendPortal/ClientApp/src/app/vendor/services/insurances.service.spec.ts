import { TestBed, inject } from '@angular/core/testing';

import { InsurancesService } from './insurances.service';

describe('InsurancesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsurancesService]
    });
  });

  it('should be created', inject([InsurancesService], (service: InsurancesService) => {
    expect(service).toBeTruthy();
  }));
});
