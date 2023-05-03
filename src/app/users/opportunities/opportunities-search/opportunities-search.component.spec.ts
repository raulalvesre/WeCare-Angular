import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesSearchComponent } from './opportunities-search.component';

describe('OpportunitiesSearchComponent', () => {
  let component: OpportunitiesSearchComponent;
  let fixture: ComponentFixture<OpportunitiesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitiesSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunitiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
