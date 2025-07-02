import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResults } from '../../../../../shared/models/Search';
import { MovieSearchDto } from '../../../models/Movie';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-movies-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
    @Input() movies?: PaginatedResults<MovieSearchDto>;
    @Input() isDeleteModeOn?: boolean = false;
    @Output() onNewMovieId = new EventEmitter<number>();

    handleCheckboxChange(movieId: number): void {
        this.onNewMovieId.emit(movieId);
    }
}
