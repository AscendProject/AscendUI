import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaryDetailsComponent } from './disciplinary-details.component';

describe('DisciplinaryDetailsComponent', () => {
  let component: DisciplinaryDetailsComponent;
  let fixture: ComponentFixture<DisciplinaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisciplinaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
