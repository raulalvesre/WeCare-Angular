import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityInviteComponent } from './opportunity-invite.component';

describe('OpportunityInviteComponent', () => {
  let component: OpportunityInviteComponent;
  let fixture: ComponentFixture<OpportunityInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
