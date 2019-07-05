import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveinsurancelicenseComponent } from './activeinsurancelicense.component';

describe('ActiveinsurancelicenseComponent', () => {
  let component: ActiveinsurancelicenseComponent;
  let fixture: ComponentFixture<ActiveinsurancelicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveinsurancelicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveinsurancelicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
