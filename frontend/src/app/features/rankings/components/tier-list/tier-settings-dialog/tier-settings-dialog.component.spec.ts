import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierSettingsDialogComponent } from './tier-settings-dialog.component';

describe('TierSettingsDialogComponent', () => {
  let component: TierSettingsDialogComponent;
  let fixture: ComponentFixture<TierSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierSettingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TierSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
