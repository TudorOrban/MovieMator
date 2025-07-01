import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { MovieSearchDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { MoviesHeaderComponent } from "./movies-header/movies-header.component";
import { MoviesListComponent } from "./movies-list/movies-list.component";

@Component({
    selector: 'app-movies',
    imports: [CommonModule, FontAwesomeModule, MoviesHeaderComponent, MoviesListComponent],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit {
    movies?: PaginatedResults<MovieSearchDto>;
    userId?: number = 1; // Placeholder
    searchParams: SearchParams = {
        searchText: "",
        sortBy: "createdAt",
        isAscending: true,
        page: 1,
        itemsPerPage: 20
    };

    constructor(
        private movieService: MovieService,
    ) {}

    ngOnInit() {
        if (!this.userId) return;

        this.movieService.searchMovies(this.userId, this.searchParams).subscribe({
            next: (data) => {
                console.log("Movies: ", data);
                this.movies = data;
            },
            error: (error) => {
                console.error("Error searching movies: ", error);
            }
        });
    }
}
