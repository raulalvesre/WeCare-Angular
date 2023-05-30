import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSliderAltComponent } from './card-slider-alt.component';

describe('CardSliderAltComponent', () => {
  let component: CardSliderAltComponent;
  let fixture: ComponentFixture<CardSliderAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSliderAltComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSliderAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
