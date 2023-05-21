import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteersIssuesComponent } from './volunteers-issues.component';

describe('VolunteersIssuesComponent', () => {
  let component: VolunteersIssuesComponent;
  let fixture: ComponentFixture<VolunteersIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteersIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteersIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
