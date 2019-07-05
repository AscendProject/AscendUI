import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorTypeStatusComponent } from './edit-vendor-type-status.component';

describe('EditVendorTypeStatusComponent', () => {
  let component: EditVendorTypeStatusComponent;
  let fixture: ComponentFixture<EditVendorTypeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVendorTypeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorTypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
