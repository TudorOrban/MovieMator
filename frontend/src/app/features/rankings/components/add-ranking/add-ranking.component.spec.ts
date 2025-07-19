import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRankingComponent } from './add-ranking.component';

describe('AddRankingComponent', () => {
  let component: AddRankingComponent;
  let fixture: ComponentFixture<AddRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
