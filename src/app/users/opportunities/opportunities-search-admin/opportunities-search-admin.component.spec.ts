import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesSearchAdminComponent } from './opportunities-search-admin.component';

describe('OpportunitiesSearchAdminComponent', () => {
  let component: OpportunitiesSearchAdminComponent;
  let fixture: ComponentFixture<OpportunitiesSearchAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitiesSearchAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunitiesSearchAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
