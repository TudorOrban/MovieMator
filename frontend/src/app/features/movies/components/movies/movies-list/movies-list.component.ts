import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResults } from '../../../../../shared/models/Search';
import { MovieSearchDto } from '../../../models/Movie';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-movies-list',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
    @Input() movies?: PaginatedResults<MovieSearchDto>;
    @Input() isDeleteModeOn?: boolean = false;
    @Input() isLoading?: boolean = false;
    @Output() onNewMovieId = new EventEmitter<number>();

    handleCheckboxChange(movieId: number): void {
        this.onNewMovieId.emit(movieId);
    }

    faSpinner = faSpinner;
    faStar = faStar;
}
