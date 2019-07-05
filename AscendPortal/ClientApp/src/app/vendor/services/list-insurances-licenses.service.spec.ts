import { TestBed, inject } from '@angular/core/testing';

import { ListInsurancesLicensesService } from './list-insurances-licenses.service';

describe('ListInsurancesLicensesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListInsurancesLicensesService]
    });
  });

  it('should be created', inject([ListInsurancesLicensesService], (service: ListInsurancesLicensesService) => {
    expect(service).toBeTruthy();
  }));
});
