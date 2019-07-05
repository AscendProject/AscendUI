import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFinancialInformationComponent } from './add-edit-financial-information.component';

describe('AddEditFinancialInformationComponent', () => {
  let component: AddEditFinancialInformationComponent;
  let fixture: ComponentFixture<AddEditFinancialInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFinancialInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFinancialInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
