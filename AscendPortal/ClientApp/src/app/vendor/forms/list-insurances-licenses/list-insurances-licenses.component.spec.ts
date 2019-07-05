import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsurancesLicensesComponent } from './list-insurances-licenses.component';

describe('ListInsurancesLicensesComponent', () => {
  let component: ListInsurancesLicensesComponent;
  let fixture: ComponentFixture<ListInsurancesLicensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInsurancesLicensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInsurancesLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
