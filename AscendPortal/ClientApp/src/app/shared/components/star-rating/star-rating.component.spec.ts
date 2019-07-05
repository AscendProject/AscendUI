import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatButtonModule, MatButton, MatTooltipModule, MatDialogModule,
  MatIconModule, MatSnackBarModule
} from '@angular/material';
import { MatRipple, ThemePalette } from '@angular/material/core';
import { StarRatingComponent } from '../index';

describe('Star Rating Component Test Cases', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarRatingComponent],
      providers: [], 
      imports: [MatTooltipModule, MatDialogModule, MatButtonModule, MatIconModule, MatSnackBarModule ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('1. should create a component ', () => {
    expect(component).toBeTruthy();
  });

  it('2. should create an instance', () => {
    expect(component).toBeDefined();
  });

  it('3. should execute for loop and assign value to rating array', () => {
    const mockRatingArr = [0, 1];
    component.starRating(2);
    expect(component.ratingArr).toEqual(mockRatingArr);
  });

  it('4. should retrun mat-icon based on rating value', () => {
    component.rating = 3;
    const index = 0;
    let r = component.showIcon(index);
    expect(r).toEqual('star');
  });

  it('5. should render `star` mat-icon if rating value is greater than ratingArr index', async(() => {
    component.starRating(2);
    component.ratingArr;
    component.rating = 3;
    const index = 0;
    let r = component.showIcon(index);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('mat-icon');
    expect(compiled.textContent).toContain('star');
  }));

  it('6. should render `star_border` mat-icon if rating value is not greater than ratingArr index', async(() => {
    component.starRating(2);
    component.ratingArr;
    component.rating = 0;
    const index = 0;
    let r = component.showIcon(index);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('mat-icon');
    expect(compiled.textContent).toContain('star_border');
  }));

  it('7. should called onClick method when click on button', () => {
    const mockRatingArr = [0, 1];
    component.starRating(2);
    component.ratingArr;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.queryAll(By.css('button'));
      const compiled = fixture.debugElement.nativeElement.querySelector('button');
      spyOn(component, "onClick").and.callThrough();
      compiled.dispatchEvent(new Event('click'));
      fixture.whenStable().then(() => {
        expect(component.onClick).toHaveBeenCalled();
      })
      fixture.detectChanges();
    });
  })

  it('8. should emits ratingUpdated event after called onClick method', () => {
    let rating: number;
    component.ratingUpdated.subscribe((value) =>
      rating = value
    );
    component.onClick(2);
    fixture.whenStable().then(() => {
      expect(rating).toBe(2);
    })
  });

  it('9. should display mat-error message if star count null or 0', async(() => {
    component.starCount = 0;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('mat-error');
    expect(compiled.textContent).toContain('Star count is required and cannot be zero');
  }));

  it('10. should mat-error message `required` string in <strong> tag', async(() => {
    component.starCount = null;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('strong');
    expect(compiled.textContent).toContain('required');
  }));

  it('11. should render a star', () => {
    component.ratingArr = <any>[0,1,2,3];
    component.color = 'primary';
    component.showIcon(2);
    fixture.detectChanges();
    const s = fixture.debugElement.nativeElement;
    const ts = s.querySelectorAll("button");
    expect(ts.length).toEqual(4);
  });

});
