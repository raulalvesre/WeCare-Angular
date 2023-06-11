import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateComponentComponent } from './certificate-component.component';

describe('CertificateComponentComponent', () => {
  let component: CertificateComponentComponent;
  let fixture: ComponentFixture<CertificateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
