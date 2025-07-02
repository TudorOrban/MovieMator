import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovieFilters, PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { MovieSearchDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { MoviesHeaderComponent } from "./movies-header/movies-header.component";
import { MoviesListComponent } from "./movies-list/movies-list.component";

@Component({
    selector: 'app-movies',
    imports: [CommonModule, FontAwesomeModule, MoviesHeaderComponent, MoviesListComponent],
    templateUrl: './movies.component.html',
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
    movieFilters: MovieFilters = {}

    isDeleteModeOn: boolean = false;
    toBeDeletedMovieIds: number[] = [];

    constructor(
        private movieService: MovieService,
    ) {}

    ngOnInit() {
        this.searchMovies();
    }

    searchMovies(): void {
        if (!this.userId) return;

        this.movieService.searchMovies(this.userId, this.searchParams, this.movieFilters).subscribe({
            next: (data) => {
                this.movies = data;
            },
            error: (error) => {
                console.error("Error searching movies: ", error);
            }
        });
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
    }

    handleNewMovieId(id: number): void {
        if (this.toBeDeletedMovieIds.includes(id)) {
            this.toBeDeletedMovieIds = this.toBeDeletedMovieIds.filter(movieId => movieId !== id);
        } else {
            this.toBeDeletedMovieIds.push(id);
        }
    }

    deleteMovies(): void {
        if (!this.isDeleteModeOn || this.toBeDeletedMovieIds.length === 0) return;

        this.movieService.deleteMovies(this.toBeDeletedMovieIds).subscribe({
            next: () => {
                this.isDeleteModeOn = false;
                this.searchMovies();
            },
            error: (error) => {
                console.error("Error deleting movies: ", error);
            }
        })
    }
}
