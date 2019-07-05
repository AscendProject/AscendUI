import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactpageAuditHistoryComponent } from './contactpage-audit-history.component';

describe('ContactpageAuditHistoryComponent', () => {
  let component: ContactpageAuditHistoryComponent;
  let fixture: ComponentFixture<ContactpageAuditHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactpageAuditHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactpageAuditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
