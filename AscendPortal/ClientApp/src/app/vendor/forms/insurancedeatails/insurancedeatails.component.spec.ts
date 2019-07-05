import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancedeatailsComponent } from './insurancedeatails.component';

describe('InsurancedeatailsComponent', () => {
  let component: InsurancedeatailsComponent;
  let fixture: ComponentFixture<InsurancedeatailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancedeatailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancedeatailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
