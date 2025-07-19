import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileConsentComponent } from './public-profile-consent.component';

describe('PublicProfileConsentComponent', () => {
  let component: PublicProfileConsentComponent;
  let fixture: ComponentFixture<PublicProfileConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProfileConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProfileConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
