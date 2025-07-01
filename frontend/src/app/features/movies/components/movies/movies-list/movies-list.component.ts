import { Component, Input } from '@angular/core';
import { PaginatedResults } from '../../../../../shared/models/Search';
import { MovieSearchDto } from '../../../models/Movie';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-movies-list',
    imports: [CommonModule],
    templateUrl: './movies-list.component.html',
    styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {
    @Input() movies?: PaginatedResults<MovieSearchDto>;


}
