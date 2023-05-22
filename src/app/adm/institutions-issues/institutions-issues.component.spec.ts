import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsIssuesComponent } from './institutions-issues.component';

describe('InstitutionsIssuesComponent', () => {
  let component: InstitutionsIssuesComponent;
  let fixture: ComponentFixture<InstitutionsIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionsIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionsIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
