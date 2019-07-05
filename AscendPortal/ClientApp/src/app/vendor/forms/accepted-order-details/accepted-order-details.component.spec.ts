import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedOrderDetailsComponent } from './accepted-order-details.component';

describe('AcceptedOrderDetailsComponent', () => {
  let component: AcceptedOrderDetailsComponent;
  let fixture: ComponentFixture<AcceptedOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptedOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
