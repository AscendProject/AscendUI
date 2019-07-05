import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionListUploadComponent } from './exclusion-list-upload.component';

describe('ExclusionListUploadComponent', () => {
  let component: ExclusionListUploadComponent;
  let fixture: ComponentFixture<ExclusionListUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusionListUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionListUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
