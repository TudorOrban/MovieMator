import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRankingComponent } from './update-ranking.component';

describe('UpdateRankingComponent', () => {
  let component: UpdateRankingComponent;
  let fixture: ComponentFixture<UpdateRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
