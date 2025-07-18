import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsersHeaderComponent } from './search-users-header.component';

describe('SearchUsersHeaderComponent', () => {
  let component: SearchUsersHeaderComponent;
  let fixture: ComponentFixture<SearchUsersHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUsersHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUsersHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
