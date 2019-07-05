import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeclineDialogComponent } from './order-decline-dialog.component';

describe('OrderDeclineDialogComponent', () => {
  let component: OrderDeclineDialogComponent;
  let fixture: ComponentFixture<OrderDeclineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeclineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeclineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
