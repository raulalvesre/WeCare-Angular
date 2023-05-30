import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSliderPhotosComponent } from './card-slider-photos.component';

describe('CardSliderPhotosComponent', () => {
  let component: CardSliderPhotosComponent;
  let fixture: ComponentFixture<CardSliderPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSliderPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSliderPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
