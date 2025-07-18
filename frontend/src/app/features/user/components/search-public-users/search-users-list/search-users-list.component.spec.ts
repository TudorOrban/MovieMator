import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsersListComponent } from './search-users-list.component';

describe('SearchUsersListComponent', () => {
  let component: SearchUsersListComponent;
  let fixture: ComponentFixture<SearchUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUsersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
