import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishedComponent } from './accomplished.component';

describe('AccomplishedComponent', () => {
  let component: AccomplishedComponent;
  let fixture: ComponentFixture<AccomplishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomplishedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccomplishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
