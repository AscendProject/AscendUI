import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvendorComponent } from './addvendor.component';

describe('AddvendorComponent', () => {
  let component: AddvendorComponent;
  let fixture: ComponentFixture<AddvendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddvendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
