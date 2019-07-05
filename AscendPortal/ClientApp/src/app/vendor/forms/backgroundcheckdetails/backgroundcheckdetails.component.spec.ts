import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundcheckdetailsComponent } from './backgroundcheckdetails.component';

describe('BackgroundcheckdetailsComponent', () => {
  let component: BackgroundcheckdetailsComponent;
  let fixture: ComponentFixture<BackgroundcheckdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundcheckdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundcheckdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
