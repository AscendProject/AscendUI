import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAdvancedSearchComponent } from './vendor-advanced-search.component';

describe('VendorAdvancedSearchComponent', () => {
  let component: VendorAdvancedSearchComponent;
  let fixture: ComponentFixture<VendorAdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAdvancedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
