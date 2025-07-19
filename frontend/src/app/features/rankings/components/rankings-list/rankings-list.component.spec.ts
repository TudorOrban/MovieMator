import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsListComponent } from './rankings-list.component';

describe('RankingsListComponent', () => {
  let component: RankingsListComponent;
  let fixture: ComponentFixture<RankingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
