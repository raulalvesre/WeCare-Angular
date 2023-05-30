import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCausesComponent } from './featured-causes.component';

describe('FeaturedCausesComponent', () => {
  let component: FeaturedCausesComponent;
  let fixture: ComponentFixture<FeaturedCausesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedCausesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedCausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
