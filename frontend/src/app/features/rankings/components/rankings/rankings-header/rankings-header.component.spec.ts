import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsHeaderComponent } from './rankings-header.component';

describe('RankingsHeaderComponent', () => {
  let component: RankingsHeaderComponent;
  let fixture: ComponentFixture<RankingsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
