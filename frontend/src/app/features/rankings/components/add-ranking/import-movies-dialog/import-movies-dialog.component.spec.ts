import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMoviesDialogComponent } from './import-movies-dialog.component';

describe('ImportMoviesDialogComponent', () => {
  let component: ImportMoviesDialogComponent;
  let fixture: ComponentFixture<ImportMoviesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportMoviesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportMoviesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
