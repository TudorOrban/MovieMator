import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPublicUsersComponent } from './search-public-users.component';

describe('SearchPublicUsersComponent', () => {
  let component: SearchPublicUsersComponent;
  let fixture: ComponentFixture<SearchPublicUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPublicUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPublicUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
