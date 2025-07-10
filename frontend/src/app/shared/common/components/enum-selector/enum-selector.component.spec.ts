import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumSelectorComponent } from './enum-selector.component';

describe('EnumSelectorComponent', () => {
  let component: EnumSelectorComponent;
  let fixture: ComponentFixture<EnumSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnumSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnumSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
