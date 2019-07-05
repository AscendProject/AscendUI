import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensedetailsComponent } from './licensedetails.component';

describe('LicensedetailsComponent', () => {
  let component: LicensedetailsComponent;
  let fixture: ComponentFixture<LicensedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
