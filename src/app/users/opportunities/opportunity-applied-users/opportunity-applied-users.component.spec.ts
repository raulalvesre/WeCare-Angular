import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAppliedUsersComponent } from './opportunity-applied-users.component';

describe('OpportunityAppliedUsersComponent', () => {
  let component: OpportunityAppliedUsersComponent;
  let fixture: ComponentFixture<OpportunityAppliedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityAppliedUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityAppliedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
