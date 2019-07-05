import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcoverageComponent } from './addcoverage.component';

describe('AddcoverageComponent', () => {
  let component: AddcoverageComponent;
  let fixture: ComponentFixture<AddcoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
