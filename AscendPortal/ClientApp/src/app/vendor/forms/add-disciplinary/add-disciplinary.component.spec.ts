import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisciplinaryComponent } from './add-disciplinary.component';

describe('AddDisciplinaryComponent', () => {
  let component: AddDisciplinaryComponent;
  let fixture: ComponentFixture<AddDisciplinaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDisciplinaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDisciplinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
